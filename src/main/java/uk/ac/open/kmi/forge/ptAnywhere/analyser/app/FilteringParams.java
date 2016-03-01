package uk.ac.open.kmi.forge.ptAnywhere.analyser.app;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.QueryParam;

/**
 * Parameters which allow to filter registrations' search.
 */
public class FilteringParams {

    final DateTimeFormatter fmt = ISODateTimeFormat.dateTime();

    @QueryParam("start") String start;
    @QueryParam("end") String end;
    @DefaultValue("2") @QueryParam("minStatements") int minStatements;


    public DateTime getSince() {
        return AnalyserApp.parseDate(this.fmt, this.start);
    }

    public DateTime getUntil() {
        return AnalyserApp.parseDate(this.fmt, this.end);
    }
}
