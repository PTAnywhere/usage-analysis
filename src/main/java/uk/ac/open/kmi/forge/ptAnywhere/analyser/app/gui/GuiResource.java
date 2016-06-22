package uk.ac.open.kmi.forge.ptAnywhere.analyser.app.gui;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;


@Path("/")
public class GuiResource extends AbstractViewableResource {

    @GET @Path("find.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getFindPage() {
        return buildResponse("/find.ftl");
    }

    @GET @Path("summary.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getSummaryCharts() {
        return buildResponse("/summary.ftl");
    }

    @GET @Path("sessions/{session}")
    @Produces(MediaType.TEXT_HTML)
    public Response getSessionLandingPage(@PathParam("session") String sessionId) throws URISyntaxException {
        return Response.seeOther(new URI("sessions/" + sessionId + "/index.html")).build();
    }

    @GET @Path("session.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getSessionPage(@PathParam("session") String sessionId) {
        final Map<String, Object> map = new HashMap<String, Object>();
        return buildResponse("/session.ftl");
    }

    @GET @Path("sessions/{session}/replayer.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getReplayer(@PathParam("session") String sessionId) {
        final Map<String, Object> map = new HashMap<String, Object>();
        map.put("sessionId", sessionId);
        return buildResponse("/replayer.ftl", map, new PathElement("Sessions"),
                new PathElement("sessions/" + sessionId, sessionId),
                new PathElement("sessions/" + sessionId + "/replayer.html", "Replayer"));
    }
}
