package uk.ac.open.kmi.forge.ptAnywhere.analyser.app.data;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.QueryParam;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;


/**
 * Parameters which allow to filter registrations' search.
 */
public class FilteringParams {

    final DateTimeFormatter fmt = ISODateTimeFormat.dateTime();

    @QueryParam("start") String start;
    @QueryParam("end") String end;
    @DefaultValue("2") @QueryParam("minStatements") int minStatements;


    public DateTime parseDate(String date) {
        if (date==null) return null;
        return fmt.parseDateTime(date);
    }

    public DateTime getSince() {
        return parseDate( this.start);
    }

    public DateTime getUntil() {
        return parseDate(this.end);
    }
}
