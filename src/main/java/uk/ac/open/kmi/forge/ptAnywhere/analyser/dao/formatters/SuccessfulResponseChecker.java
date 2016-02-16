package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.formatters;

import com.rusticisoftware.tincan.lrsresponses.StatementsResultLRSResponse;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


public class SuccessfulResponseChecker {
    public static void checkSuccessful(StatementsResultLRSResponse response) {
        if (!response.getSuccess())
            throw new LRSException(response.getErrMsg());
    }
}
