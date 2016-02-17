package uk.ac.open.kmi.forge.ptAnywhere.analyser.app;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.MalformedURLException;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.TinCanDAO;


@Path("usage")
public class UsageDataResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsageSummaries(@Context ServletContext servletContext) throws MalformedURLException {
        final TinCanDAO dao = AnalyserApp.getTinCanDAO(servletContext);
        return Response.ok(dao.getSimplifiedActionsPerSession().toString()).build();
    }
}
