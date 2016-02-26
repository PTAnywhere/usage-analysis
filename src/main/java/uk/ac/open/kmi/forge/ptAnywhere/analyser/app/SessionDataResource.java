package uk.ac.open.kmi.forge.ptAnywhere.analyser.app;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.LearningLockerDAO;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.tincan.TinCanDAO;

import javax.servlet.ServletContext;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.MalformedURLException;


@Path("sessions")
public class SessionDataResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRegistrations(@Context ServletContext servletContext,
                                      @DefaultValue("2") @QueryParam("minStatements") int step,
                                      @QueryParam("start") String start,
                                      @QueryParam("end") String end) throws MalformedURLException {
        final DateTimeFormatter fmt = ISODateTimeFormat.dateTime();
        final DateTime since = AnalyserApp.parseDate(fmt, start);
        final DateTime until = AnalyserApp.parseDate(fmt, end);

        final LearningLockerDAO dao = AnalyserApp.getLearningLockerDAO(servletContext);
        // Filter sessions with less than 'step' statements (/events) registered.
        // This way, sessions where nothing else apart from allocating PT has been done will be filtered.
        return Response.ok(dao.getRegistrations(step, since, until).toString()).build();
    }

    @Path("{registration}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStatementsInRegistration(@Context ServletContext servletContext,
                                      @PathParam("registration") String registrationId) throws MalformedURLException {
        final TinCanDAO dao = AnalyserApp.getTinCanDAO(servletContext);
        return Response.ok(dao.getStatements(registrationId)).build();
    }


    @Path("counter")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // Order by hour
    public Response getSessionCountPerHour(@Context ServletContext servletContext,
                                    @DefaultValue("2") @QueryParam("minStatements") int minStatements,
                                    @QueryParam("start") String start,
                                    @QueryParam("end") String end) throws MalformedURLException {
        final DateTimeFormatter fmt = ISODateTimeFormat.dateTime();
        final DateTime since = AnalyserApp.parseDate(fmt, start);
        final DateTime until = AnalyserApp.parseDate(fmt, end);
        final LearningLockerDAO dao = AnalyserApp.getLearningLockerDAO(servletContext);
        return Response.ok(dao.countSessionsPerHour(minStatements, since, until)).build();
    }

    @Path("actions")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // Order by hour
    public Response getSessionCountPerActions(@Context ServletContext servletContext,
                                    @QueryParam("start") String start,
                                    @QueryParam("end") String end) throws MalformedURLException {
        final DateTimeFormatter fmt = ISODateTimeFormat.dateTime();
        final DateTime since = AnalyserApp.parseDate(fmt, start);
        final DateTime until = AnalyserApp.parseDate(fmt, end);
        final LearningLockerDAO dao = AnalyserApp.getLearningLockerDAO(servletContext);
        return Response.ok(dao.countSessionsPerNumberOfActions(since, until)).build();
    }
}