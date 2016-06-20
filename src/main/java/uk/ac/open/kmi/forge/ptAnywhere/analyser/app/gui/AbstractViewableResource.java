package uk.ac.open.kmi.forge.ptAnywhere.analyser.app.gui;

import org.glassfish.jersey.server.mvc.Viewable;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.app.AnalyserApp;

import javax.servlet.ServletContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public abstract class AbstractViewableResource {

    @Context
    ServletContext servletContext;

    protected String getAppRootURL() {
        return (String) servletContext.getAttribute(AnalyserApp.APP_ROOT);
    }

    protected List<PathElement> getBreadcrumb() {
        final List<PathElement> ret = new ArrayList<PathElement>();
        ret.add(new PathElement("find.html", "Home"));
        return ret;
    }

    public Viewable getPreFilled(String path, Map<String, Object> map, PathElement... breadcrumbs) {
        final String appBase = getAppRootURL();
        map.put("base", appBase);
        map.put("dependencies", appBase + "/static/js/dashboard/dependencies");
        final List<PathElement> breadcrumb = getBreadcrumb();
        for (PathElement el: breadcrumbs) breadcrumb.add(el);
        map.put("breadcrumb", breadcrumb);
        return (new Viewable(path, map));
    }

    public Response buildResponse(String template, Map<String, Object> map, PathElement... breadcrumbs) {
        return Response.ok(getPreFilled(template, map, breadcrumbs)).build();
    }

    public Response buildResponse(String template, PathElement... breadcrumbs) {
        return Response.ok(getPreFilled(template, new HashMap<String, Object>(), breadcrumbs)).build();
    }

    public static class PathElement {
        final String url;
        final String name;

        public PathElement(String name) {
            this(null, name);
        }

        public PathElement(String url, String name) {
            this.url = url;
            this.name = name;
        }

        public String getUrl() {
            return url;
        }

        public String getName() {
            return name;
        }
    }
}