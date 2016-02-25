package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.responses;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import java.util.List;

import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.ResultItem;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


public class CountingResponse extends AbstractGenericResponse<CountingResponse.ResultEl> {

    public CountingResponse() {}

    public List<ResultEl> getResult() {
        return result;
    }

    static public class ResultEl implements ResultItem {
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

    @Override
    public JsonArray toJson() throws LRSException {
        final JsonArrayBuilder ret = Json.createArrayBuilder();
        int index = 1;
        for (ResultEl el: getResult()) {
            while (index < el.get_id()) {
                ret.add(0);
                index++;
            }
            ret.add(el.getCount());
            index++;  // Or index = count;
        }
        return ret.build();
    }
}
