package uk.ac.open.kmi.forge.ptAnywhere.analyser.app.data;

import javax.servlet.ServletContext;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.MalformedURLException;

import uk.ac.open.kmi.forge.ptAnywhere.analyser.app.AnalyserApp;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.LearningLockerDAO;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.tincan.TinCanDAO;


@Path("/data/sessions")
public class SessionDataResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRegistrations(@Context ServletContext servletContext,
                                     @BeanParam FilteringParams filters,
                                     @DefaultValue("") @QueryParam("containsCommand") String containsCmd) throws MalformedURLException {
        final LearningLockerDAO dao = AnalyserApp.getLearningLockerDAO(servletContext);
        // Filter sessions with less than 'step' statements (/events) registered.
        // This way, sessions where nothing else apart from allocating PT has been done will be filtered.
        return Response.ok(dao.getRegistrations(filters.minStatements, filters.getSince(), filters.getUntil(), containsCmd).toString()).build();
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
                                           @BeanParam FilteringParams filters) throws MalformedURLException {
        final LearningLockerDAO dao = AnalyserApp.getLearningLockerDAO(servletContext);
        return Response.ok(dao.countSessionsPerHour(filters.minStatements, filters.getSince(), filters.getUntil())).build();
    }

    @Path("perStatements")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // Order by hour
    public Response getSessionCountPerActions(@Context ServletContext servletContext,
                                              @BeanParam FilteringParams filters) throws MalformedURLException {
        final LearningLockerDAO dao = AnalyserApp.getLearningLockerDAO(servletContext);
        return Response.ok(dao.countSessionsPerNumberOfActions(filters.getSince(), filters.getUntil())).build();
    }

    @Path("scatterplot")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // Order by hour
    public Response getSessionStartingTimeCountingStatements(@Context ServletContext servletContext,
                                              @BeanParam FilteringParams filters) throws MalformedURLException {
        final LearningLockerDAO dao = AnalyserApp.getLearningLockerDAO(servletContext);
        return Response.ok(dao.getSessionsCountingStatements(filters.getSince(), filters.getUntil())).build();
    }
}