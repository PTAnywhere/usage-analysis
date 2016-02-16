package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.formatters;

import com.rusticisoftware.tincan.Activity;
import com.rusticisoftware.tincan.Statement;
import com.rusticisoftware.tincan.Verb;
import com.rusticisoftware.tincan.lrsresponses.StatementsResultLRSResponse;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.BaseVocabulary;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.StatementResultFormatter;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import java.net.URI;
import java.util.*;


/**
 * Returns an array of sessions with their actions shaped as simplified strings.
 */
public class SimplifiedStatesFormatter implements StatementResultFormatter<JsonArray> {


    private boolean isDevice(Activity activity) {
        final URI type = activity.getId();
        if (type == null) return false;
        return type.toString().startsWith(BaseVocabulary.SIMULATED_DEVICE);
    }

    private String getSimplifiedState(Verb verb, Activity activity) {
        if (activity.getDefinition().getType().toString().equals(BaseVocabulary.COMMAND_LINE)) {
            return "CMD";
        }
        if (verb.getId().toString().equals(BaseVocabulary.UPDATED)) {
            return "UPD";
        }
        if (verb.getId().toString().equals(BaseVocabulary.CREATED)) {
            if (isDevice(activity)) return "ADD";
            return "CONN";
        }
        if (verb.getId().toString().equals(BaseVocabulary.DELETED)) {
            if (isDevice(activity)) return "DEL";
            return "DISCONN";
        }
        return null;
    }

    @Override
    public JsonArray toJson(StatementsResultLRSResponse response) throws LRSException {
        SuccessfulResponseChecker.checkSuccessful(response);

        final JsonArrayBuilder jab = Json.createArrayBuilder();

        final List<UUID> registrationsInOrder = new ArrayList<UUID>();
        final Map<UUID, JsonArrayBuilder> actionsByRegistration = new HashMap<UUID, JsonArrayBuilder>();
        for (Statement st : response.getContent().getStatements()) {
            final UUID registration = st.getContext().getRegistration();
            if (!actionsByRegistration.containsKey(registration)) {
                registrationsInOrder.add(registration);
                actionsByRegistration.put(registration, Json.createArrayBuilder()); //new ArrayList<String>());
            }
            final String state = getSimplifiedState(st.getVerb(), (Activity) st.getObject());
            if (state != null) {
                //final JsonString s = Json.createObjectBuilder().build().getJsonString(state);
                actionsByRegistration.get(registration).add(state);
            }
        }
        // success, use lrsRes.getContent() to get the StatementsResult object

        for (UUID registration: registrationsInOrder) {
            jab.add(actionsByRegistration.get(registration).build());
        }
        return jab.build();
    }
}
