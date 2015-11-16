package uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;


/**
 * Wraps exceptions thrown by TinCan API.
 */
public class LRSException extends WebApplicationException {
    public LRSException(String message) {
        super(ErrorBean.createError(Response.Status.INTERNAL_SERVER_ERROR, message).build());
    }
}
