package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.formatters;

import com.rusticisoftware.tincan.Statement;
import com.rusticisoftware.tincan.lrsresponses.StatementsResultLRSResponse;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.StatementResultFormatter;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import java.util.*;


/**
 * It returns an array of registration UUIDs for each registration with more than <i>minStatements</i> statements.
 */
public class RegistrationsFormatter implements StatementResultFormatter<JsonArray> {

    final int minStatements;

    public RegistrationsFormatter(int minStatements) {
        this.minStatements = minStatements;
    }

    /**
     * Problem of the current implementation:
     *     - It processes all the statements in the LRS.
     *     - The statement limit must be set to the maximum to avoid ignoring latest sessions.
     */
    @Override
    public JsonArray toJson(StatementsResultLRSResponse response) throws LRSException {
        SuccessfulResponseChecker.checkSuccessful(response);

        final JsonArrayBuilder jab = Json.createArrayBuilder();

        final Map<String, Integer> registrations = new HashMap<String, Integer>();
        for (Statement st : response.getContent().getStatements()) {
            final String registrationUuid = st.getContext().getRegistration().toString();
            Integer numberStatements = registrations.get(registrationUuid);
            numberStatements = (numberStatements==null)? 1: numberStatements+1;  // Update
            registrations.put(registrationUuid, numberStatements);
            if (numberStatements==this.minStatements) { // == to add it only one time
                jab.add(registrationUuid);
            }
        }
        return jab.build();
    }
}
