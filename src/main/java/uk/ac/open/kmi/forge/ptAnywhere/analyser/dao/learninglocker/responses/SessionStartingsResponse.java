package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.responses;

import java.util.Iterator;
import java.util.List;
import javax.json.*;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.ResultItem;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


public class SessionStartingsResponse extends AbstractGenericResponse<SessionStartingsResponse.RegistrationEl> {

    DateTime since, until;

    public SessionStartingsResponse() {}

    public List<RegistrationEl> getResult() {
        return result;
    }

    static public class RegistrationEl implements ResultItem {
        String timestamp;

        public RegistrationEl() {}

        /*public String getTimestamp() {
            return timeout;
        }*/

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

    final DateTime getNextSessionDate(final Iterator<RegistrationEl> it) {
        return (it.hasNext())? it.next().getDateTimestamp(): null;
    }

    @Override
    public JsonObject toJson() throws LRSException {
        final JsonObjectBuilder ret = Json.createObjectBuilder();
        final DateTimeFormatter fmt = ISODateTimeFormat.dateTime();
        ret.add("start", fmt.print(this.since));
        ret.add("end", fmt.print(this.until));

        final JsonArrayBuilder array = Json.createArrayBuilder();
        final Iterator<RegistrationEl> it = getResult().iterator();
        DateTime time = this.since;
        DateTime endTime;
        DateTime sessionStartDate = getNextSessionDate(it);

        while (!time.isAfter(this.until)) {  // time <= until  === !( time > until )
            endTime = time.plusHours(1);
            int count = 0;
            // Inclusive in start time, exclusive in end time
            while (sessionStartDate!=null && !sessionStartDate.isBefore(time) && sessionStartDate.isBefore(endTime)) {
                count++;
                sessionStartDate = getNextSessionDate(it);  // Previous session was already classified
            }
            array.add(count);
            time = endTime;
        }
        ret.add("values", array);

        return ret.build();
    }
}
