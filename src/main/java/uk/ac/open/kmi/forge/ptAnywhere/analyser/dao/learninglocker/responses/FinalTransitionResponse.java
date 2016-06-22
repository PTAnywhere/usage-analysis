package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.responses;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.ResultItem;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;

import java.util.List;


public class FinalTransitionResponse extends AbstractGenericResponse<RegistrationsResponse.RegistrationEl> {

    public FinalTransitionResponse() {}

    public List<RegistrationsResponse.RegistrationEl> getResult() {
        return result;
    }

    static public class RegistrationEl implements ResultItem {
        String _id;

        public RegistrationEl() {}

        public String get_id() {
            return _id;
        }

        public void set_id(String _id) {
            this._id = _id;
        }
    }

    @Override
    public JsonObject toJson() throws LRSException {
        final JsonObjectBuilder ret = Json.createObjectBuilder();
        final boolean passed = !this.result.isEmpty();
        ret.add("passed", passed);
        return ret.build();
    }
}
