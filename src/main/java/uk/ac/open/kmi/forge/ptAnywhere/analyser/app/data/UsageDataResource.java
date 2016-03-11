package uk.ac.open.kmi.forge.ptAnywhere.analyser.app.data;

import javax.servlet.ServletContext;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.MalformedURLException;

import uk.ac.open.kmi.forge.ptAnywhere.analyser.app.AnalyserApp;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.LearningLockerDAO;


@Path("/data/usage")
public class UsageDataResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsageSummaries(@Context ServletContext servletContext,
                                      @BeanParam FilteringParams filters) throws MalformedURLException {
        final LearningLockerDAO dao = AnalyserApp.getLearningLockerDAO(servletContext);
        return Response.ok(dao.getStateTransitions(filters.getSince(), filters.getUntil()).toString()).build();
    }

    @Path("{registration}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsageForSession(@Context ServletContext servletContext,
                                       @PathParam("registration") String registrationId) throws MalformedURLException {
        final LearningLockerDAO dao = AnalyserApp.getLearningLockerDAO(servletContext);
        return Response.ok(dao.getStateTransitions(registrationId).toString()).build();
    }
}
