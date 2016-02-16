package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao;

import com.rusticisoftware.tincan.lrsresponses.StatementsResultLRSResponse;
import javax.json.JsonStructure;


/**
 * It processes a LRS response to generate a custom JSON format.
 */
public interface StatementResultFormatter<T extends JsonStructure> {
    T toJson(StatementsResultLRSResponse response);
}
