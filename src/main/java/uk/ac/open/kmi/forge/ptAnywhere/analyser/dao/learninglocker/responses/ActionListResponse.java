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

            private boolean isDevice(String activityId) {
                return activityId.startsWith(BaseVocabulary.SIMULATED_DEVICE);
            }

            protected enum State { ADD, DEL, UPD, CONN, DISCONN, CMD, NOOP };

            protected static JsonArrayBuilder getStateJsonArray() {
                final JsonArrayBuilder ret = Json.createArrayBuilder();
                for(State s: State.values()) {
                    ret.add(s.name());
                }
                return ret;
            }

            State getSimplifiedState() {
                if (getDefinitionType().equals(BaseVocabulary.COMMAND_LINE)) {
                    if (getVerbId().equals(BaseVocabulary.READ)) return null;  // Ignore read activities.
                    return State.CMD;
                }
                if (getVerbId().equals(BaseVocabulary.UPDATED)) {
                    return State.UPD;
                }
                if (getVerbId().equals(BaseVocabulary.CREATED)) {
                    if (isDevice(getObjectId())) return State.ADD;
                    return State.CONN;
                }
                if (getVerbId().equals(BaseVocabulary.DELETED)) {
                    if (isDevice(getObjectId())) return State.DEL;
                    return State.DISCONN;
                }
                return null;
            }
        }
    }

    @Override
    public JsonArray toJson() throws LRSException {
        final JsonArrayBuilder ret = Json.createArrayBuilder();
        for (ActionsPerRegistration el: this.result) {
            final JsonArrayBuilder subret = Json.createArrayBuilder();
            for (ActionsPerRegistration.SubElement sel: el.getStatements()) {
                final ActionsPerRegistration.SubElement.State state = sel.getSimplifiedState();
                if (state != null) subret.add(state.name());
            }
            ret.add(subret);
        }
        return ret.build();
    }
}
