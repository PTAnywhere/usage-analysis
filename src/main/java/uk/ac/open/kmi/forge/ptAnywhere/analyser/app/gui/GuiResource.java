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
        final Map<String, Object> map = new HashMap<String, Object>();
        return buildResponse("/find.ftl");
    }

    @GET @Path("summaries/states.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getStateChart() {
        final Map<String, Object> map = new HashMap<String, Object>();
        return buildResponse("/usage.ftl", map, new PathElement("Summaries"),
                new PathElement("summaries/states.html", "State chart"));
    }

    @GET @Path("summaries/sessions_started.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getSessionsStartHistogram() {
        final Map<String, Object> map = new HashMap<String, Object>();
        return buildResponse("/histogram.ftl", map, new PathElement("Summaries"),
                new PathElement("summaries/sessions_started.html", "Sessions started"));
    }

    @GET @Path("summaries/activity.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getActivityHistogram() {
        final Map<String, Object> map = new HashMap<String, Object>();
        return buildResponse("/activity_count.ftl", map, new PathElement("Summaries"),
                new PathElement("summaries/activity.html", "Activity histogram"));
    }

    @GET @Path("summaries/activity_time.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getActivityScatterplot() {
        final Map<String, Object> map = new HashMap<String, Object>();
        return buildResponse("/scatterplot.ftl", map, new PathElement("Summaries"),
                new PathElement("summaries/activity_time.html", "Activity volume over time"));
    }

    @GET @Path("sessions/{session}")
    @Produces(MediaType.TEXT_HTML)
    public Response getSessionLandingPage(@PathParam("session") String sessionId) throws URISyntaxException {
        return Response.seeOther(new URI("sessions/" + sessionId + "/index.html")).build();
    }

    @GET @Path("sessions/{session}/index.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getSessionPage(@PathParam("session") String sessionId) {
        final Map<String, Object> map = new HashMap<String, Object>();
        map.put("sessionId", sessionId);
        return buildResponse("/session.ftl", map, new PathElement("Sessions"),
                                new PathElement("sessions/" + sessionId, sessionId));
    }

    @GET @Path("sessions/{session}/usage.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getUsageDiagram(@PathParam("session") String sessionId) {
        final Map<String, Object> map = new HashMap<String, Object>();
        map.put("sessionId", sessionId);
        return buildResponse("/usage.ftl", map, new PathElement("Sessions"),
                new PathElement("sessions/" + sessionId, sessionId),
                new PathElement("sessions/" + sessionId + "/usage.html", "Usage diagram"));
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
