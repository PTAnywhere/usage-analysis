package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.responses;

import java.util.List;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.GenericResponse;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.ResultItem;


public abstract class AbstractGenericResponse<T extends ResultItem> implements GenericResponse<T> {
    int ok;
    List<T> result;

    public AbstractGenericResponse() {}

    @Override
    public int getOk() {
        return ok;
    }

    @Override
    public void setOk(int ok) {
        this.ok = ok;
    }

    @Override
    public void setResult(List<T> result) {
        this.result = result;
    }

}
