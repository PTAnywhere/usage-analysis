package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker;

import java.util.List;
import javax.json.JsonStructure;

import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


/**
 * Generic response returned by LearningLocker aggregation API.
 */
public interface GenericResponse<T extends ResultItem> {
    int getOk();
    void setOk(int ok);

    // Jersey throws a ResponseProcessingException on unmarshalling the Json response
    // If result getter is provided here (no matter if it is abstract or not).
    /*public abstract List<T> getResult();
    public List<T> getResult() {
        return result;
    }*/
    void setResult(List<T> result);

    JsonStructure toJson() throws LRSException;
}
