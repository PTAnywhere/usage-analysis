package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.formatters;

import java.util.Map;
import java.util.UUID;
import java.util.HashMap;
import java.util.Iterator;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import com.rusticisoftware.tincan.RemoteLRS;
import com.rusticisoftware.tincan.Statement;
import com.rusticisoftware.tincan.lrsresponses.StatementsResultLRSResponse;
import com.rusticisoftware.tincan.v10x.StatementsQuery;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


/**
 * It returns an array of registration UUIDs for each registration with more than <i>minStatements</i> statements.
 *
 * For this, it makes several subqueries.
 */
@Deprecated
public class RegistrationsFormatterSubquerying extends RegistrationsFormatter {

    final RemoteLRS lrs;

    public RegistrationsFormatterSubquerying(int minStatements, RemoteLRS lrs) {
        super(minStatements);
        this.lrs = lrs;
    }

    /**
     * Problem of the current implementation:
     *     - It processes all the statements in the LRS.
     *     - The statement limit must be set to the maximum to avoid ignoring latest sessions.
     */
    @Override
    public JsonArray toJson(Iterator<Statement> statements) throws LRSException {
        final JsonArrayBuilder jab = Json.createArrayBuilder();

        final Map<String, Integer> registrations = new HashMap<String, Integer>();
        while (statements.hasNext()) {
            final Statement st = statements.next();
            final UUID registrationUuid = st.getContext().getRegistration();
            if (this.minStatements == 1) {
                // We already know that the statement with the initialized verb exists
                jab.add(registrations.get(registrationUuid.toString()));
            } else {
                // Query to check that this registration has at least N statements
                final StatementsQuery subquery = new StatementsQuery();
                subquery.setLimit(this.minStatements);  // We don't need to process more...
                subquery.setRegistration(registrationUuid);

                final StatementsResultLRSResponse lrsSubRes = this.lrs.queryStatements(subquery);
                if (lrsSubRes.getSuccess()) {
                    if (lrsSubRes.getContent().getStatements().size()>=this.minStatements) {
                        jab.add(registrationUuid.toString());
                    }
                }
            }
        }
        return jab.build();
    }
}
