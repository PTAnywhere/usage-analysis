package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao;

import javax.json.JsonArray;
import javax.json.JsonObject;
import org.joda.time.DateTime;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


/**
 * Data access object for learning record store.
 */
public interface DAO {
    JsonObject getStateTransitions(DateTime since, DateTime until) throws LRSException;

    JsonObject getStateTransitions(String registrationId) throws LRSException;

    String getStatements(String registrationUuid);

    JsonArray getRegistrations() throws LRSException;

    JsonArray getRegistrations(int minStatements, DateTime since, DateTime until) throws LRSException;

    JsonObject countSessionsPerHour(int minStatements, DateTime since, DateTime until) throws LRSException;

    JsonArray countSessionsPerNumberOfActions(DateTime since, DateTime until) throws LRSException;
}
