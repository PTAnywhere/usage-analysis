package uk.ac.open.kmi.forge.ptAnywhere.analyser.app;

import java.net.MalformedURLException;
import java.util.Properties;
import java.io.IOException;
import javax.annotation.PreDestroy;
import javax.servlet.ServletContext;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Context;
import com.rusticisoftware.tincan.RemoteLRS;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.mvc.MvcFeature;
import org.glassfish.jersey.server.mvc.freemarker.FreemarkerMvcFeature;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.app.data.SessionDataResource;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.app.gui.GuiResource;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.LearningLockerDAO;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.tincan.TinCanDAO;


@ApplicationPath("a")
public class AnalyserApp extends ResourceConfig {

    private static final Log LOGGER = LogFactory.getLog(AnalyserApp.class);

    private static final String LRS_ENDPOINT = "endpoint";
    private static final String XAPI_PATH = "data/xAPI/";
    private static final String LLAPI_PATH = "api/v1/";

    public static final String APP_TITLE = "title";
    public static final String APP_ROOT = "path";
    public static final String LRS_XAPI = "xapi";
    public static final String LRS_LLAPI = "llapi";
    public static final String LRS_USERNAME = "username";
    public static final String LRS_PASSWD = "password";

    public AnalyserApp(@Context ServletContext servletContext) throws IOException {
        super(new ResourceConfig().
                  register(FreemarkerMvcFeature.class).
                  property(MvcFeature.TEMPLATE_BASE_PATH, "templates").
                  property(FreemarkerMvcFeature.CACHE_TEMPLATES, true).
                  packages(SessionDataResource.class.getPackage().getName(),
                           GuiResource.class.getPackage().getName())
        );

        final Properties props = new Properties();
        props.load(AnalyserApp.class.getClassLoader().getResourceAsStream("environment.properties"));
        servletContext.setAttribute(APP_TITLE, props.getProperty("title"));
        servletContext.setAttribute(APP_ROOT, props.getProperty("tomcat.path", "/"));

        final String filePath = props.getProperty("la-property-file", "False");
        if (filePath.toLowerCase().equals("false")) {
            LOGGER.error("The LRS details could not be loaded. 'la-property-file' property missing.");
        } else {
            loadLRSProperties(servletContext, filePath);
        }
    }

    public void loadLRSProperties(ServletContext servletContext, String propertyFileLRS) {
        try {
            final Properties lRSDetails = new Properties();
            lRSDetails.load(AnalyserApp.class.getClassLoader().getResourceAsStream(propertyFileLRS));

            // We use the same properties names as in the property file.
            servletContext.setAttribute(LRS_XAPI, lRSDetails.getProperty(LRS_ENDPOINT) + XAPI_PATH);
            servletContext.setAttribute(LRS_LLAPI, lRSDetails.getProperty(LRS_ENDPOINT) + LLAPI_PATH);
            servletContext.setAttribute(LRS_USERNAME, lRSDetails.getProperty(LRS_USERNAME));
            servletContext.setAttribute(LRS_PASSWD, lRSDetails.getProperty(LRS_PASSWD));
        } catch(IOException e) {
            LOGGER.error("The properties file could not be read.");
        }
    }

    @PreDestroy
    public void stop() {
        try {
            RemoteLRS.destroy();
        } catch(Exception e) {
            LOGGER.error("The RemoteLRS cannot be properly destroyed.");
        }
    }

    public static TinCanDAO getTinCanDAO(ServletContext servletContext) throws MalformedURLException {
        return new TinCanDAO(
                (String) servletContext.getAttribute(AnalyserApp.LRS_XAPI),
                (String) servletContext.getAttribute(AnalyserApp.LRS_USERNAME),
                (String) servletContext.getAttribute(AnalyserApp.LRS_PASSWD)
        );
    }

    public static LearningLockerDAO getLearningLockerDAO(ServletContext servletContext) throws MalformedURLException {
        return new LearningLockerDAO(
                (String) servletContext.getAttribute(AnalyserApp.LRS_LLAPI),
                (String) servletContext.getAttribute(AnalyserApp.LRS_USERNAME),
                (String) servletContext.getAttribute(AnalyserApp.LRS_PASSWD)
        );
    }
}
