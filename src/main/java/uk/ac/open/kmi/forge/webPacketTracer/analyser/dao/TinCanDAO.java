package uk.ac.open.kmi.forge.webPacketTracer.analyser.dao;

import com.rusticisoftware.tincan.*;
import com.rusticisoftware.tincan.lrsresponses.StatementsResultLRSResponse;
import com.rusticisoftware.tincan.v10x.StatementsQuery;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonString;
import java.net.MalformedURLException;
import java.net.URI;
import java.util.*;


public class TinCanDAO {

    final RemoteLRS lrs = new RemoteLRS();

    private static final String WIDGET = "http://ict-forge.eu/widget/packerTracer";

    /* Verbs */
    private static final String CREATED = "http://activitystrea.ms/schema/1.0/create";
    private static final String DELETED = "http://activitystrea.ms/schema/1.0/delete";
    private static final String UPDATED = "http://activitystrea.ms/schema/1.0/update";

    /* Objects */
    private static final String DEVICE_TYPE = WIDGET + "/devices/type/";

    public TinCanDAO(String endpoint, String username, String password) throws MalformedURLException {
        this.lrs.setEndpoint(endpoint);
        this.lrs.setVersion(TCAPIVersion.V100);
        this.lrs.setUsername(username);
        this.lrs.setPassword(password);
    }

    private boolean isDevice(Activity activity) {
        final URI type = activity.getDefinition().getType();
        if (type == null) return false;
        return type.toString().startsWith(DEVICE_TYPE);
    }

    private String getSimplifiedState(Verb verb, StatementTarget obj) {
        if (verb.getId().toString().equals(UPDATED)) {
            return "UPD";
        }
        if (!(obj instanceof Activity)) return null; // I hate this

        final Activity activity = (Activity) obj;
        if (verb.getId().toString().equals(CREATED)) {
            if (isDevice(activity)) return "ADD";
            return "CONN";
        }
        if (verb.getId().toString().equals(DELETED)) {
            if (isDevice(activity)) return "DEL";
            return "DISCONN";
        }
        return null;
    }

    public JsonArray getActionsPerSession() {
        final Map<UUID, JsonArrayBuilder> ret = new HashMap<UUID, JsonArrayBuilder>();

        final StatementsQuery query = new StatementsQuery();
        query.setAscending(true);
        //query.setSince(new DateTime("2013-09-30T13:15:00.000Z"));

        final StatementsResultLRSResponse lrsRes = this.lrs.queryStatements(query);
        if (lrsRes.getSuccess()) {
            for (Statement st : lrsRes.getContent().getStatements()) {
                final UUID registration = st.getContext().getRegistration();
                if (!ret.containsKey(registration)) {
                    ret.put(registration, Json.createArrayBuilder()); //new ArrayList<String>());
                }
                final String state = getSimplifiedState(st.getVerb(), st.getObject());
                if (state != null) {
                    //final JsonString s = Json.createObjectBuilder().build().getJsonString(state);
                    ret.get(registration).add(state);
                }
            }
            // success, use lrsRes.getContent() to get the StatementsResult object
            final JsonArrayBuilder jab = Json.createArrayBuilder();
            for (JsonArrayBuilder perSession: ret.values()) {
                jab.add(perSession.build());
            }
            return jab.build();
        }
        // failure, error information is available in lrsRes.getErrMsg()
        return null;
    }
}