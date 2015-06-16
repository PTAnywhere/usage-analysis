package uk.ac.open.kmi.forge.webPacketTracer.analyser.app;


import uk.ac.open.kmi.forge.webPacketTracer.analyser.dao.TinCanDAO;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.MalformedURLException;


@Path("usage")
public class UsageDataResource {

    private TinCanDAO getTinCanDAO(ServletContext servletContext) throws MalformedURLException {
        return new TinCanDAO(
                    (String) servletContext.getAttribute(AnalyserApp.LRS_ENDPOINT),
                    (String) servletContext.getAttribute(AnalyserApp.LRS_USERNAME),
                    (String) servletContext.getAttribute(AnalyserApp.LRS_PASSWD)
        );
    }

    @GET
    //@Produces(MediaType.APPLICATION_JSON)
    public Response getUsageSummaries(@Context ServletContext servletContext) throws MalformedURLException {
        final TinCanDAO dao = getTinCanDAO(servletContext);
        return Response.ok(dao.getActionsPerSession().toString()).build();
    }
}
