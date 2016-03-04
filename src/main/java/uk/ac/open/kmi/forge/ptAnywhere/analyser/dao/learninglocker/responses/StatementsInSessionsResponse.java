package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.responses;


import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.ResultItem;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;

import javax.json.*;
import java.util.Iterator;
import java.util.List;


public class StatementsInSessionsResponse extends AbstractGenericResponse<StatementsInSessionsResponse.RegistrationCounting> {

    DateTime since, until;

    public StatementsInSessionsResponse() {}

    public List<RegistrationCounting> getResult() {
        return result;
    }

    static public class RegistrationCounting implements ResultItem {
        String _id;
        int count;
        String timestamp;

        public RegistrationCounting() {}

        public String get_id() {
            return _id;
        }

        public void set_id(String _id) {
            this._id = _id;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }

        public void setTimestamp(String timestamp) {
            this.timestamp = timestamp;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public DateTime getDateTimestamp() {
            final DateTimeFormatter fmt = ISODateTimeFormat.dateTime();
            return fmt.parseDateTime(this.timestamp);
        }
    }

    public void setPeriod(DateTime since, DateTime until) {
        this.since = since;
        this.until = until;
    }

    final DateTime getNextSessionDate(final Iterator<RegistrationCounting> it) {
        return (it.hasNext())? it.next().getDateTimestamp(): null;
    }

    @Override
    public JsonArray toJson() throws LRSException {
        final JsonArrayBuilder ret = Json.createArrayBuilder();
        for (RegistrationCounting r: getResult()) {
            final JsonObjectBuilder point = Json.createObjectBuilder();
            point.add("x", r.getDateTimestamp().toString());
            point.add("y", r.getCount());
            point.add("label", r.get_id());
            ret.add(point);
        }
        return ret.build();
    }
}
