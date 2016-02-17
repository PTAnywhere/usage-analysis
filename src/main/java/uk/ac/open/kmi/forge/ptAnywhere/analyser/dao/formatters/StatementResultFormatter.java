package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.formatters;

import java.util.Iterator;
import javax.json.JsonStructure;
import com.rusticisoftware.tincan.Statement;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


/**
 * It processes a LRS response to generate a custom JSON format.
 */
public interface StatementResultFormatter<T extends JsonStructure> {
    T toJson(Iterator<Statement> response) throws LRSException;
}
