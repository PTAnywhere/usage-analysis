package uk.ac.open.kmi.forge.ptAnywhere.analyser.app.gui;

import org.glassfish.jersey.server.mvc.Viewable;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.app.AnalyserApp;

import javax.servlet.ServletContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;


public abstract class AbstractViewableResource {

    @Context
    ServletContext servletContext;

    protected String getAppRootURL() {
        return (String) servletContext.getAttribute(AnalyserApp.APP_ROOT);
    }

    protected String getTitle() {
        return (String) servletContext.getAttribute(AnalyserApp.APP_TITLE);
    }

    public Viewable getPreFilled(String path, Map<String, Object> map) {
        final String appBase = getAppRootURL();
        map.put("base", appBase);
        map.put("dependencies", appBase + "/static/js/vendors");
        map.put("title", getTitle());
        return (new Viewable(path, map));
    }

    public Response buildResponse(String template, Map<String, Object> map) {
        return Response.ok(getPreFilled(template, map)).build();
    }

    public Response buildResponse(String template) {
        return Response.ok(getPreFilled(template, new HashMap<String, Object>())).build();
    }
}