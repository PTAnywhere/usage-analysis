package uk.ac.open.kmi.forge.ptAnywhere.analyser.app;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.glassfish.jersey.server.ResourceConfig;

import javax.servlet.ServletContext;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Context;
import java.io.IOException;
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

}
