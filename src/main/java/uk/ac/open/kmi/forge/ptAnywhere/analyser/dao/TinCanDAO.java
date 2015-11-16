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
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


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

    public JsonArray getActionsPerSession() throws LRSException {
        final StatementsQuery query = new StatementsQuery();
        query.setAscending(true);
        //query.setSince(new DateTime("2013-09-30T13:15:00.000Z"));

        final JsonArrayBuilder jab = Json.createArrayBuilder();
        final StatementsResultLRSResponse lrsRes = this.lrs.queryStatements(query);
        if (lrsRes.getSuccess()) {
            final List<UUID> registrationsInOrder = new ArrayList<UUID>();
            final Map<UUID, JsonArrayBuilder> actionsByRegistration = new HashMap<UUID, JsonArrayBuilder>();
            for (Statement st : lrsRes.getContent().getStatements()) {
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
        } // else
        throw new LRSException(lrsRes.getErrMsg());
    }

    public String getActions(String registrationUuid) {
        final StatementsQuery query = new StatementsQuery();
        query.setAscending(true);
        query.setRegistration(UUID.fromString(registrationUuid));

        final StatementsResultLRSResponse lrsRes = this.lrs.queryStatements(query);
        if (lrsRes.getSuccess()) {
            return lrsRes.getContent().toJSON();
        } // else
        throw new LRSException(lrsRes.getErrMsg());
    }


    public JsonArray getRegistrations() throws LRSException {
        return getRegistrations(1);
    }

    public JsonArray getRegistrations(int minStatements) throws LRSException {
        final StatementsQuery query = new StatementsQuery();
        query.setAscending(true);

        final JsonArrayBuilder jab = Json.createArrayBuilder();
        final StatementsResultLRSResponse lrsRes = this.lrs.queryStatements(query);
        if (lrsRes.getSuccess()) {
            final Map<String, Integer> registrations = new HashMap<String, Integer>();
            for (Statement st : lrsRes.getContent().getStatements()) {
                final String registrationUuid = st.getContext().getRegistration().toString();
                Integer numberStatements = registrations.get(registrationUuid);
                numberStatements = (numberStatements==null)? 1: numberStatements+1;  // Update
                registrations.put(registrationUuid, numberStatements);
                if (numberStatements==minStatements) { // == to add it only one time
                    jab.add(registrationUuid);
                }
            }
            return jab.build();
        }
        // else
        throw new LRSException(lrsRes.getErrMsg());
    }
}