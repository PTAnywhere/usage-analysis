package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.tincan.formatters;

import java.util.*;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import java.net.URI;
import com.rusticisoftware.tincan.Activity;
import com.rusticisoftware.tincan.Statement;
import com.rusticisoftware.tincan.Verb;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.BaseVocabulary;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


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
        final String verbStr = verb.getId().toString();

        if (activity.getDefinition().getType().toString().equals(BaseVocabulary.COMMAND_LINE)) {
            if (verbStr.equals(BaseVocabulary.READ)) return null;  // Ignore read activities.
            return "CMD";
        }
        if (verbStr.equals(BaseVocabulary.UPDATED)) {
            return "UPD";
        }
        if (verbStr.equals(BaseVocabulary.CREATED)) {
            if (isDevice(activity)) return "ADD";
            return "CONN";
        }
        if (verbStr.equals(BaseVocabulary.DELETED)) {
            if (isDevice(activity)) return "DEL";
            return "DISCONN";
        }
        return null;
    }

    @Override
    public JsonArray toJson(Iterator<Statement> statements) throws LRSException {
        final JsonArrayBuilder jab = Json.createArrayBuilder();

        final List<UUID> registrationsInOrder = new ArrayList<UUID>();
        final Map<UUID, JsonArrayBuilder> actionsByRegistration = new HashMap<UUID, JsonArrayBuilder>();
        while (statements.hasNext()) {
            final Statement st = statements.next();
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
