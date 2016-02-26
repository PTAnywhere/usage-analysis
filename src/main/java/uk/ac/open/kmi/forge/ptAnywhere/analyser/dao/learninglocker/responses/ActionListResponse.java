package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.responses;

import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.BaseVocabulary;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.ResultItem;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


public class ActionListResponse extends AbstractGenericResponse<ActionListResponse.ActionsPerRegistration> {

    public ActionListResponse() {}

    public List<ActionsPerRegistration> getResult() {
        return result;
    }

    static public class ActionsPerRegistration implements ResultItem {
        String _id;
        List<SubElement> registrations;

        public ActionsPerRegistration() {}

        public String get_id() {
            return _id;
        }

        public void set_id(String _id) {
            this._id = _id;
        }

        public List<SubElement> getStatements() {
            return registrations;
        }

        public void setStatements(List<SubElement> registrations) {
            this.registrations = registrations;
        }

        static public class SubElement {
            String verbId;
            String objectId;
            String definitionType;

            public SubElement() {}

            public String getVerbId() {
                return verbId;
            }

            public void setVerbId(String verbId) {
                this.verbId = verbId;
            }

            public String getObjectId() {
                return objectId;
            }

            public void setObjectId(String objectId) {
                this.objectId = objectId;
            }

            public String getDefinitionType() {
                return definitionType;
            }

            public void setDefinitionType(String definitionType) {
                this.definitionType = definitionType;
            }
        }
    }

    private boolean isDevice(String activityId) {
        return activityId.startsWith(BaseVocabulary.SIMULATED_DEVICE);
    }

    private String getSimplifiedState(ActionsPerRegistration.SubElement el) {
        if (el.getDefinitionType().equals(BaseVocabulary.COMMAND_LINE)) {
            if (el.getVerbId().equals(BaseVocabulary.READ)) return null;  // Ignore read activities.
            return "CMD";
        }
        if (el.getVerbId().equals(BaseVocabulary.UPDATED)) {
            return "UPD";
        }
        if (el.getVerbId().equals(BaseVocabulary.CREATED)) {
            if (isDevice(el.getObjectId())) return "ADD";
            return "CONN";
        }
        if (el.getVerbId().equals(BaseVocabulary.DELETED)) {
            if (isDevice(el.getObjectId())) return "DEL";
            return "DISCONN";
        }
        return null;
    }

    @Override
    public JsonArray toJson() throws LRSException {
        final JsonArrayBuilder ret = Json.createArrayBuilder();
        for (ActionsPerRegistration el: this.result) {
            final JsonArrayBuilder subret = Json.createArrayBuilder();
            for (ActionsPerRegistration.SubElement sel: el.getStatements()) {
                final String state = getSimplifiedState(sel);
                if (state != null) subret.add(state);
            }
            ret.add(subret);
        }
        return ret.build();
    }
}
