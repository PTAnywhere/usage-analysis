package uk.ac.open.kmi.forge.ptAnywhere.analyser.app;

import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.TinCanDAO;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.net.MalformedURLException;


@Path("sessions")
public class SessionDataResource {

    private TinCanDAO getTinCanDAO(ServletContext servletContext) throws MalformedURLException {
        return new TinCanDAO(
                    (String) servletContext.getAttribute(AnalyserApp.LRS_ENDPOINT),
                    (String) servletContext.getAttribute(AnalyserApp.LRS_USERNAME),
                    (String) servletContext.getAttribute(AnalyserApp.LRS_PASSWD)
        );
    }

    @GET
    public Response getUsageSummaries(@Context ServletContext servletContext) throws MalformedURLException {
        final TinCanDAO dao = getTinCanDAO(servletContext);
        // Filter sessions with less than 2 statements (/events) registered.
        // This way, sessions where nothing else apart from allocating PT has been done will be filtered.
        return Response.ok(dao.getRegistrations(2).toString()).build();
    }

    @Path("{registration}")
    @GET
    //@Produces(MediaType.APPLICATION_JSON)
    public Response getUsageSummaries(@Context ServletContext servletContext,
                                      @PathParam("registration") String registrationId) throws MalformedURLException {
        final TinCanDAO dao = getTinCanDAO(servletContext);
        return Response.ok(dao.getActions(registrationId)).build();  //dao.getActions(sessionId).toString()).build();
    }
}