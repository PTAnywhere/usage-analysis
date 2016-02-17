package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.formatters;

import java.util.*;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import com.rusticisoftware.tincan.Statement;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


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
    public JsonArray toJson(Iterator<Statement> statements) throws LRSException {
        final JsonArrayBuilder jab = Json.createArrayBuilder();

        final Map<String, Integer> registrations = new HashMap<String, Integer>();
        while (statements.hasNext()) {
            final Statement st = statements.next();
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
