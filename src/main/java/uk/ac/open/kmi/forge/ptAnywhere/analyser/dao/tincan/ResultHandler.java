package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.tincan;

import java.util.Iterator;
import java.util.concurrent.*;
import com.rusticisoftware.tincan.RemoteLRS;
import com.rusticisoftware.tincan.Statement;
import com.rusticisoftware.tincan.lrsresponses.StatementsResultLRSResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


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
    LRSException exceptionToBeThrown;



    public ResultHandler(RemoteLRS lrs, StatementsResultLRSResponse oldResponse) {
        this.requestExecutor = Executors.newSingleThreadExecutor();
        this.lrs = lrs;
        this.nextStatements = null;
        this.exceptionToBeThrown = null;
        updateStatements(oldResponse);
        requestMoreResults(oldResponse);
    }

    /**
     * @return The new result used to update statements.
     */
    protected void updateStatements(StatementsResultLRSResponse newResponse) {
        if (newResponse.getSuccess()) {
            this.statements = newResponse.getContent().getStatements().iterator();
        } else {
            this.exceptionToBeThrown = new LRSException(newResponse.getErrMsg());
        }
    }

    protected void requestMoreResults(StatementsResultLRSResponse response) {
        this.nextStatements = null;
        if (response.getContent()!=null) {
            final String moreUrl = response.getContent().getMoreURL();
            if ( moreUrl!=null && !moreUrl.equals("")) {
                this.nextStatements = this.requestExecutor.submit(
                        new Callable<StatementsResultLRSResponse>() {
                            @Override
                            public StatementsResultLRSResponse call() {
                                LOGGER.info("Sending request to get more results:" + moreUrl);
                                return lrs.moreStatements(moreUrl);
                            }
                        });
            }
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

    boolean stHasNext() {
        if (this.exceptionToBeThrown!=null) throw this.exceptionToBeThrown;
        return this.statements.hasNext();
    }

    @Override
    public boolean hasNext() throws LRSException {
        if (stHasNext()) {
            return true;
        } else {
            updateResult();
            return stHasNext();
        }
    }

    @Override
    public Statement next() {
        return this.statements.next();
    }
}
