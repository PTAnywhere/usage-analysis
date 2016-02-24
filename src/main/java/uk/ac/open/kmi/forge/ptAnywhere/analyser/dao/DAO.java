package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao;

import org.joda.time.DateTime;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;

import javax.json.JsonArray;
import javax.json.JsonObject;

/**
 * Created by agg96 on 2/24/16.
 */
public interface DAO {
    JsonArray getSimplifiedActionsPerSession(DateTime since, DateTime until) throws LRSException;

    String getStatements(String registrationUuid);

    JsonArray getRegistrations() throws LRSException;

    JsonArray getRegistrations(int minStatements, DateTime since, DateTime until) throws LRSException;

    JsonObject countActions(int minStatements, DateTime since, DateTime until) throws LRSException;

    JsonArray countSessionsPerNumberOfActions(DateTime since, DateTime until) throws LRSException;
}
