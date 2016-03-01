package uk.ac.open.kmi.forge.ptAnywhere.analyser.app;

import javax.servlet.ServletContext;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.MalformedURLException;

import org.jboss.logging.Param;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.LearningLockerDAO;


@Path("usage")
public class UsageDataResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsageSummaries(@Context ServletContext servletContext,
                                      @QueryParam("start") String start,
                                      @QueryParam("end") String end) throws MalformedURLException {
        final DateTimeFormatter fmt = ISODateTimeFormat.dateTime();
        final DateTime since = AnalyserApp.parseDate(fmt, start);
        final DateTime until = AnalyserApp.parseDate(fmt, end);

        final LearningLockerDAO dao = AnalyserApp.getLearningLockerDAO(servletContext);
        return Response.ok(dao.getSimplifiedActionsPerSessions(since, until).toString()).build();
    }

    @Path("{registration}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsageForSession(@Context ServletContext servletContext,
                                       @PathParam("registration") String registrationId) throws MalformedURLException {
        final LearningLockerDAO dao = AnalyserApp.getLearningLockerDAO(servletContext);
        return Response.ok(dao.getSimplifiedActionsPerSession(registrationId).toString()).build();
    }
}
