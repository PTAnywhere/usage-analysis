package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao;

import java.util.*;
import java.net.URI;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import java.net.MalformedURLException;
import com.rusticisoftware.tincan.*;
import com.rusticisoftware.tincan.lrsresponses.StatementsResultLRSResponse;
import com.rusticisoftware.tincan.v10x.StatementsQuery;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


public class TinCanDAO {

    private static final Log LOGGER = LogFactory.getLog(TinCanDAO.class);

    final RemoteLRS lrs = new RemoteLRS();


    public TinCanDAO(String endpoint, String username, String password) throws MalformedURLException {
        this.lrs.setEndpoint(endpoint);
        this.lrs.setVersion(TCAPIVersion.V100);
        this.lrs.setUsername(username);
        this.lrs.setPassword(password);
    }

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
                final String state = getSimplifiedState(st.getVerb(), (Activity) st.getObject());
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