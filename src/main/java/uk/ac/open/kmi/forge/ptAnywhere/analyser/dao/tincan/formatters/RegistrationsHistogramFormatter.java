package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.tincan.formatters;

import com.rusticisoftware.tincan.Statement;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;

import javax.json.*;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.TreeMap;


/**
 * It returns a JSON representing the number of sessions started in a given time interval classified per hour.
 */
public class RegistrationsHistogramFormatter implements StatementResultFormatter<JsonObject> {

    final DateTime since, until;
    final int minStatements;


    public RegistrationsHistogramFormatter(DateTime since, DateTime until, int minStatements) {
        this.since = since;
        this.until = until;
        this.minStatements = minStatements;
    }

    class SimplifiedRegistration {
        int actionCount = 0;
        final DateTime simplifiedDate;
        SimplifiedRegistration(DateTime when) {
            this.simplifiedDate = new DateTime(when.getYear(), when.getMonthOfYear(), when.getDayOfMonth(),
                                                when.getHourOfDay(), 0, 0, 0);
        }
        void increaseCount() {
            this.actionCount++;
        }
        boolean hasMinimumStatements() {
            return this.actionCount >= minStatements;
        }
    }

    @Override
    public JsonObject toJson(Iterator<Statement> results) throws LRSException {
        // Filter for sessions with less than "minStatements"
        final Map<String, SimplifiedRegistration> registrations = new HashMap<String, SimplifiedRegistration>();
        while (results.hasNext()) {
            final Statement st = results.next();
            final String registrationUuid = st.getContext().getRegistration().toString();
            if (!registrations.containsKey(registrationUuid)) {
                // Gets date of the first action -> session initialization
                registrations.put(registrationUuid, new SimplifiedRegistration(st.getStored()));
            }
            registrations.get(registrationUuid).increaseCount();
        }

        // Count sessions per hour
        final Map<DateTime, Integer> sessionCountPerHour = new TreeMap<DateTime, Integer>();
        for (SimplifiedRegistration registration: registrations.values()) {
            if (registration.hasMinimumStatements()) {
                final Integer numSessions = sessionCountPerHour.get(registration.simplifiedDate);
                if (numSessions==null) {
                    sessionCountPerHour.put(registration.simplifiedDate, 1);
                } else {
                    sessionCountPerHour.put(registration.simplifiedDate, numSessions + 1);
                }
            }
        }

        // Generate JSON object
        final JsonObjectBuilder ret = Json.createObjectBuilder();
        final DateTimeFormatter fmt = ISODateTimeFormat.dateTime();
        ret.add("start", fmt.print(this.since));
        ret.add("end", fmt.print(this.until));
        final JsonArrayBuilder array = Json.createArrayBuilder();
        /*for (Integer counter: sessionCountPerHour.values()) {
            array.add(counter);
        }*/
        DateTime time = this.since;
        while (!time.isAfter(this.until)) {  // time <= until  === !( time > until )
            time = time.plusHours(1);
            if (sessionCountPerHour.containsKey(time)) {
                array.add(sessionCountPerHour.get(time));
            } else {
                array.add(0);
            }
        }
        ret.add("values", array);

        return ret.build();
    }

}
