package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.responses;

import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;

import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.ResultItem;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


public class RegistrationsResponse extends AbstractGenericResponse<RegistrationsResponse.RegistrationEl> {

    public RegistrationsResponse() {}

    public List<RegistrationEl> getResult() {
        return result;
    }

    @Override
    public void setResult(List<RegistrationEl> result) {
        this.result = result;
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
    public JsonArray toJson() throws LRSException {
        final JsonArrayBuilder ret = Json.createArrayBuilder();
        for (RegistrationEl el: this.result) {
            ret.add(el.get_id());
        }
        return ret.build();
    }
}
