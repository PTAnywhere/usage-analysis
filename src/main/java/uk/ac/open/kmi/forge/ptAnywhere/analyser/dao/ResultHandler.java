package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao;

import java.util.Iterator;
import java.util.concurrent.*;
import com.rusticisoftware.tincan.RemoteLRS;
import com.rusticisoftware.tincan.Statement;
import com.rusticisoftware.tincan.lrsresponses.StatementsResultLRSResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.formatters.SuccessfulResponseChecker;


/**
 * This object abstracts the result consumption from the need of making several requests to the LRS.
 */
public class ResultHandler implements Iterator<Statement> {

    private static final Log LOGGER = LogFactory.getLog(ResultHandler.class);

    final ExecutorService requestExecutor;
    final RemoteLRS lrs;

    // Partial cached results
    Iterator<Statement> statements;
    Future<StatementsResultLRSResponse> nextStatements;



    public ResultHandler(RemoteLRS lrs, StatementsResultLRSResponse oldResponse) {
        this.requestExecutor = Executors.newSingleThreadExecutor();
        this.lrs = lrs;
        this.nextStatements = null;
        updateStatements(oldResponse);
        requestMoreResults(oldResponse);
    }

    /**
     * @return The new result used to update statements.
     */
    protected void updateStatements(StatementsResultLRSResponse newResponse) {
        SuccessfulResponseChecker.checkSuccessful(newResponse);  // Check if it was invalid
        this.statements = newResponse.getContent().getStatements().iterator();
    }

    protected void requestMoreResults(StatementsResultLRSResponse response) {
        final String moreUrl = response.getContent().getMoreURL();
        if (moreUrl!=null) {
            this.nextStatements = this.requestExecutor.submit(
                new Callable<StatementsResultLRSResponse>() {
                    @Override
                    public StatementsResultLRSResponse call() {
                        LOGGER.info("Sending request to get more results:" + moreUrl);
                        return lrs.moreStatements(moreUrl);
                    }
                });
        } else {
            this.nextStatements = null;
        }
    }

    /**
     * @return Has the result been updated adding new statements?
     */
    protected boolean updateResult() {
        if (this.nextStatements==null) {
            return false;
        }

        try {
            final StatementsResultLRSResponse newResponse = this.nextStatements.get();
            updateStatements(newResponse);
            requestMoreResults(newResponse);
            return true;
        } catch (Exception e) {  // InterruptedException | ExecutionException
            return false;
        }
    }

    @Override
    public boolean hasNext() {
        if (this.statements.hasNext()) {
            return true;
        } else {
            updateResult();
            return this.statements.hasNext();
        }
    }

    @Override
    public Statement next() {
        return this.statements.next();
    }
}
