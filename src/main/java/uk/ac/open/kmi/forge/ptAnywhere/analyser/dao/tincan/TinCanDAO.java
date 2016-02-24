package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.tincan;

import java.net.URISyntaxException;
import java.util.*;
import javax.json.JsonArray;
import javax.json.JsonObject;
import java.net.MalformedURLException;
import com.rusticisoftware.tincan.*;
import com.rusticisoftware.tincan.lrsresponses.StatementsResultLRSResponse;
import com.rusticisoftware.tincan.v10x.StatementsQuery;
import org.joda.time.DateTime;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.BaseVocabulary;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.DAO;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.tincan.formatters.*;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


public class TinCanDAO implements DAO {

    final RemoteLRS lrs = new RemoteLRS();


    public TinCanDAO(String endpoint, String username, String password) throws MalformedURLException {
        this.lrs.setEndpoint(endpoint);
        this.lrs.setVersion(TCAPIVersion.V100);
        this.lrs.setUsername(username);
        this.lrs.setPassword(password);
    }

    StatementsQuery createQuery() {
        final StatementsQuery query = new StatementsQuery();
        query.setAscending(true);
        query.setLimit(1000);
        return query;
    }

    StatementsQuery createQuery(UUID registration) {
        final StatementsQuery query = createQuery();
        query.setRegistration(registration);
        return query;
    }

    StatementsQuery createQuery(DateTime since, DateTime until) {
        final StatementsQuery query = createQuery();
        if (since!=null) {
            query.setSince(since);
        }
        if (until!=null) {
            query.setUntil(until);
        }
        return query;
    }

    ResultHandler makeRequest(StatementsQuery query) {
        return new ResultHandler(this.lrs, this.lrs.queryStatements(query));
    }

    @Override
    public JsonArray getSimplifiedActionsPerSession(DateTime since, DateTime until) throws LRSException {
        final SimplifiedStatesFormatter formatter = new SimplifiedStatesFormatter();
        return formatter.toJson( makeRequest(createQuery(since, until)) );
    }

    @Override
    public String getStatements(String registrationUuid) {
        final StatementsQuery query = createQuery( UUID.fromString(registrationUuid) );
        final StatementsResultLRSResponse lrsRes = this.lrs.queryStatements(query);
        if (lrsRes.getSuccess()) {
            return lrsRes.getContent().toJSON();
        } // else
        throw new LRSException(lrsRes.getErrMsg());
    }


    @Override
    public JsonArray getRegistrations() throws LRSException {
        return getRegistrations(1, null, null);
    }

    @Override
    public JsonArray getRegistrations(int minStatements, DateTime since, DateTime until) throws LRSException {
        return getRegistrationsProcessAll(minStatements, since, until);
    }

    /**
     * Problem:
     *     - It processes all the statements in the LRS.
     *     - The statement limit must be set to the maximum to avoid ignoring latest sessions.
     */
    protected JsonArray getRegistrationsProcessAll(int minStatements, DateTime since, DateTime until) throws LRSException {
        final StatementsQuery query = createQuery(since, until);

        final RegistrationsFormatter formatter = new RegistrationsFormatter(minStatements);
        return formatter.toJson( makeRequest(query) );
    }

    /**
     * Problem: It creates a request for registration if minStatements>1 and this adds a significant delay.
     */
    @Deprecated
    protected JsonArray getRegistrationsWithMultipleQueries(int minStatements, DateTime since, DateTime until) throws LRSException {
        final StatementsQuery query = createQuery(since, until);
        try {
            query.setVerbID(BaseVocabulary.INITIALIZED);
        } catch (URISyntaxException e) {
            throw new LRSException(e.getMessage());
        }
        RegistrationsFormatterSubquerying formatter = new RegistrationsFormatterSubquerying(minStatements, this.lrs);
        return formatter.toJson( makeRequest(query) );
    }

    @Override
    public JsonObject countActions(int minStatements, DateTime since, DateTime until) throws LRSException {
        final StatementsQuery query = createQuery(since, until);
        query.setFormat(QueryResultFormat.IDS);
        query.setLimit(2000);
        final RegistrationsHistogramFormatter formatter = new RegistrationsHistogramFormatter(since, until, minStatements);
        return formatter.toJson( makeRequest(query) );
    }

    @Override
    public JsonArray countSessionsPerNumberOfActions(DateTime since, DateTime until) throws LRSException {
        final StatementsQuery query = createQuery(since, until);
        query.setFormat(QueryResultFormat.IDS);
        query.setLimit(2000);
        final ActionsHistogramFormatter formatter = new ActionsHistogramFormatter(since, until);
        return formatter.toJson( makeRequest(query) );
    }
}