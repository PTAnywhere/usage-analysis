package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker;

import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import java.util.*;


public class CountingResponse {
    int ok;
    List<ResultEl> result;

    public CountingResponse() {}

    public int getOk() {
        return ok;
    }

    public void setOk(int ok) {
        this.ok = ok;
    }

    public List<ResultEl> getResult() {
        return result;
    }

    public void setResult(List<ResultEl> result) {
        this.result = result;
    }

    static public class ResultEl {
        int _id;
        int count;

        public ResultEl() {}

        public int get_id() {
            return _id;
        }

        public void set_id(int _id) {
            this._id = _id;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }
    }

    public JsonArray toJson() throws LRSException {
        final JsonArrayBuilder ret = Json.createArrayBuilder();
        int index = 1;
        for (ResultEl el: this.result) {
            while (index < el._id) {
                ret.add(0);
                index++;
            }
            ret.add(el.count);
            index++;  // Or index = count;
        }
        return ret.build();
    }
}
