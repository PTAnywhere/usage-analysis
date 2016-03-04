package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker;


import javax.json.*;
import java.net.URLEncoder;
import java.io.UnsupportedEncodingException;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import org.joda.time.DateTime;
import org.glassfish.jersey.client.authentication.HttpAuthenticationFeature;

import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.BaseVocabulary;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.DAO;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.responses.*;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


public class LearningLockerDAO implements DAO {

    final WebTarget target;

    public LearningLockerDAO(String endpoint, String username, String password) {
        this.target = ClientBuilder.newClient().
                        register(HttpAuthenticationFeature.basic(username, password)).target(endpoint + "statements/aggregate");
    }

    @Override
    public JsonObject getStateTransitions(DateTime since, DateTime until) throws LRSException {
        final String pipeline = encodeParam("[{",
                "  \"$match\": {",
                "    \"statement.timestamp\": {",
                "      \"$gt\":\"" + since.toDateTimeISO() + "\",",
                "      \"$lt\":\"" + until.toDateTimeISO() + "\"",
                "    },",
                "    \"statement.verb.id\": {",
                "      \"$ne\":\"" + BaseVocabulary.READ + "\"",
                "    },",
                "    \"voided\": false",
                "  }",
                "}, {",
                "  \"$sort\": {",
                "    \"statement.timestamp\": 1",
                "  }",
                "}, {",
                "  \"$group\": {",
                "    \"_id\": \"$statement.context.registration\",",
                "    \"statements\": {",
                "        \"$push\": {",
                "           \"verbId\": \"$statement.verb.id\",",
                "           \"objectId\": \"$statement.object.id\",",
                "           \"definitionType\": \"$statement.object.definition.type\"",
                "        }",
                "    }",
                "  }",
                "}]");
        final TransitionCounterResponse cr = this.target.queryParam("pipeline", pipeline).request().get(TransitionCounterResponse.class);
        return cr.toJson();
    }

    @Override
    public JsonObject getStateTransitions(String registrationId) throws LRSException {
        final String pipeline = encodeParam("[{",
                "  \"$match\": {",
                "    \"statement.context.registration\": \"" + registrationId + "\",",
                "    \"statement.verb.id\": {",
                "      \"$ne\":\"" + BaseVocabulary.READ + "\"",
                "    },",
                "    \"voided\": false",
                "  }",
                "}, {",
                "  \"$sort\": {",
                "    \"statement.timestamp\": 1",
                "  }",
                "}, {",
                "  \"$group\": {",
                "    \"_id\": \"$statement.context.registration\",",
                "    \"statements\": {",
                "        \"$push\": {",
                "           \"verbId\": \"$statement.verb.id\",",
                "           \"objectId\": \"$statement.object.id\",",
                "           \"definitionType\": \"$statement.object.definition.type\"",
                "        }",
                "    }",
                "  }",
                "}]");
        final TransitionCounterResponse cr = this.target.queryParam("pipeline", pipeline).request().get(TransitionCounterResponse.class);
        return cr.toJson();
    }

    @Override
    public String getStatements(String registrationUuid) {
        /*final String pipeline = encodeParam("[{",
                "  \"$match\": {",
                "    \"statement.context.registration\": {",
                "      \"$eq\":\"" + registrationUuid + "\"",
                "    },",
                "    \"voided\": false",
                "  }",
                "}, {",
                "  \"$sort\": {",
                "    \"statement.timestamp\": 1",
                "  }",
                "}, {",
                "  \"$project\": {",
                "    \"_id\": 0,",
                "    \"statement\": 1",
                "  }",
                "}]");
        final StatementsResponse cr = this.target.queryParam("pipeline", pipeline).request().get(StatementsResponse.class);
        return cr.toJson().toString();*/
        return null;
    }

    @Override
    public JsonArray getRegistrations() throws LRSException {
        return getRegistrations(1, null, null);
    }

    private String encodeParam(String... el) {
        // Jersey interprets them as "template parameters"
        final String joined = String.join("", el).replace(" ","");
        try {
            // Conflict with %20 and + in URL, so better to avoid spaces...
            // More info: http://stackoverflow.com/questions/4737841/urlencoder-not-able-to-translate-space-character
            return URLEncoder.encode(joined, "UTF-8");
        } catch(UnsupportedEncodingException e) {
            return joined;
        }
    }

    @Override
    public JsonArray getRegistrations(int minStatements, DateTime since, DateTime until) throws LRSException {
        final String pipeline = encodeParam("[{",
                "  \"$match\": {",
                "    \"statement.timestamp\": {",
                "      \"$gt\":\"" + since.toDateTimeISO() + "\",",
                "      \"$lt\":\"" + until.toDateTimeISO() + "\"",
                "    },",
                "    \"statement.verb.id\": {",
                "      \"$ne\":\"" + BaseVocabulary.READ + "\"",
                "    },",
                "    \"voided\": false",
                "  }",
                "}, {",
                "  \"$group\": {",
                "    \"_id\": \"$statement.context.registration\",",
                "    \"timestamp\": { \"$min\": \"$statement.timestamp\" },",
                "    \"count\": { \"$sum\": 1 }",
                "  }",
                "}, {",
                "  \"$match\": {",
                "    \"count\": { \"$gt\": " + minStatements + "}",
                "  }",
                "}, {",
                "  \"$sort\": {",
                "    \"timestamp\": 1",
                "  }",
                "}]");
        final RegistrationsResponse cr = this.target.queryParam("pipeline", pipeline).request().get(RegistrationsResponse.class);
        return cr.toJson();
    }

    @Override
    public JsonObject countSessionsPerHour(int minStatements, DateTime since, DateTime until) throws LRSException {
        final String pipeline = encodeParam("[{",
                "  \"$match\": {",
                "    \"statement.timestamp\": {",
                "      \"$gt\":\"" + since.toDateTimeISO() + "\",",
                "      \"$lt\":\"" + until.toDateTimeISO() + "\"",
                "    },",
                "    \"statement.verb.id\": {",
                "      \"$ne\":\"" + BaseVocabulary.READ + "\"",
                "    },",
                "    \"voided\": false",
                "  }",
                "}, {",
                "  \"$group\": {",
                "    \"_id\": \"$statement.context.registration\",",
                "    \"timestamp\": { \"$min\": \"$statement.timestamp\" },",
                "    \"count\": { \"$sum\": 1 }",
                "  }",
                "}, {",
                "  \"$match\": {",
                "    \"count\": { \"$gte\": " + minStatements + "}",
                "  }",
                "}, {",
                "  \"$sort\": {",
                "    \"timestamp\": 1",
                "  }",
                "}, {",
                "  \"$project\": {",
                "    \"_id\": 0,",
                "    \"timestamp\": 1",
                "  }",
                "}]");
        final SessionStartingsResponse cr = this.target.queryParam("pipeline", pipeline).request().get(SessionStartingsResponse.class);
        cr.setPeriod(since, until);
        return cr.toJson();
    }

    @Override
    public JsonArray countSessionsPerNumberOfActions(DateTime since, DateTime until) throws LRSException {
        final String pipeline = encodeParam("[{",
                "  \"$match\": {",
                "    \"statement.timestamp\": {",
                "      \"$gt\":\"" + since.toDateTimeISO() + "\",",
                "      \"$lt\":\"" + until.toDateTimeISO() + "\"",
                "    },",
                "    \"statement.verb.id\": {",
                "      \"$ne\":\"" + BaseVocabulary.READ + "\"",
                "    },",
                "    \"voided\": false",
                "  }",
                "}, {",
                "  \"$group\": {",
                "    \"_id\": \"$statement.context.registration\",",
                "    \"count\": { \"$sum\": 1 }",
                "  }",
                "}, {",
                "  \"$group\": {",
                "    \"_id\": \"$count\",",
                "    \"count\": { \"$sum\": 1 }",
                "  }",
                "}, {",
                "  \"$sort\": {",
                "    \"_id\": 1",
                "  }",
                "}]");
        final CountingResponse cr = this.target.queryParam("pipeline", pipeline).request().get(CountingResponse.class);
        return cr.toJson();
    }
}
