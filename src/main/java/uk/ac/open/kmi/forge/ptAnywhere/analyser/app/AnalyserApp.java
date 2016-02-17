package uk.ac.open.kmi.forge.ptAnywhere.analyser.app;

import com.rusticisoftware.tincan.RemoteLRS;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.glassfish.jersey.server.ResourceConfig;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.TinCanDAO;

import javax.annotation.PreDestroy;
import javax.servlet.ServletContext;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Context;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Properties;


@ApplicationPath("data")
public class AnalyserApp extends ResourceConfig {

    private static final Log LOGGER = LogFactory.getLog(AnalyserApp.class);

    public static final String LRS_ENDPOINT = "endpoint";
    public static final String LRS_USERNAME = "username";
    public static final String LRS_PASSWD = "password";


    public AnalyserApp(@Context ServletContext servletContext) throws IOException {
        packages(getClass().getPackage().getName());
        final Properties props = new Properties();
        props.load(AnalyserApp.class.getClassLoader().getResourceAsStream("environment.properties"));

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
            servletContext.setAttribute(LRS_ENDPOINT, lRSDetails.getProperty(LRS_ENDPOINT));
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


    protected static TinCanDAO getTinCanDAO(ServletContext servletContext) throws MalformedURLException {
        return new TinCanDAO(
                (String) servletContext.getAttribute(AnalyserApp.LRS_ENDPOINT),
                (String) servletContext.getAttribute(AnalyserApp.LRS_USERNAME),
                (String) servletContext.getAttribute(AnalyserApp.LRS_PASSWD)
        );
    }


    public static DateTime parseDate(DateTimeFormatter fmt, String date) {
        if (date==null) return null;
        return fmt.parseDateTime(date);
    }
}
