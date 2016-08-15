package uk.ac.open.kmi.forge.ptAnywhere.analyser.app.gui;

import org.apache.commons.codec.binary.Base64;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.ByteBuffer;
import java.nio.LongBuffer;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


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

    @GET @Path("ibook.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getIbookChart() {
        return buildResponse("/ibook.ftl");
    }

    @GET @Path("session.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getSessionPage(@PathParam("session") String sessionId) {
        final Map<String, Object> map = new HashMap<String, Object>();
        return buildResponse("/session.ftl");
    }

    /**
     * Simplifies UUIDs converting them to base64url's Y64 variant.
     * The idea and the code was taken from:
     *   - http://stackoverflow.com/questions/21103363/base32-encode-uuid-in-java/21103563#21103563
     *
     * @param uuid
     *  Examples: "a9101f6b-ef7c-4372-91c2-9391e94ee233", "6fc7797b-1a33-4fd7-8db1-1d6e7468db65"
     * @return
     *  Examples: "qRAfa.98Q3KRwpOR6U7iMw--", "b8d5exozT9eNsR1udGjbZQ--"
     */
    private static String toSimplifiedId(java.util.UUID uuid) {
        ByteBuffer uuidBuffer = ByteBuffer.allocate(16);
        LongBuffer longBuffer = uuidBuffer.asLongBuffer();
        longBuffer.put(uuid.getMostSignificantBits());
        longBuffer.put(uuid.getLeastSignificantBits());
        String encoded = new String(Base64.encodeBase64(uuidBuffer.array()),
                Charset.forName("US-ASCII"));
        return encoded.replace('+', '.')
                .replace('/', '_')
                .replace('=', '-');
    }

    @GET @Path("sessions/{session}/replayer.html")
    @Produces(MediaType.TEXT_HTML)
    public Response getReplayer(@PathParam("session") String sessionId) {
        final String simplifiedId = toSimplifiedId(UUID.fromString(sessionId));
        final Map<String, Object> map = new HashMap<String, Object>();
        map.put("sessionId", sessionId);
        map.put("simplifiedSessionId", simplifiedId);
        return buildResponse("/replayer.ftl", map);
    }
}
