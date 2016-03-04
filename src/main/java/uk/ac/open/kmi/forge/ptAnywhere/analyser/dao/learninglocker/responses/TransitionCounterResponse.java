package uk.ac.open.kmi.forge.ptAnywhere.analyser.dao.learninglocker.responses;

import java.util.ArrayList;
import java.util.List;
import javax.json.*;
import uk.ac.open.kmi.forge.ptAnywhere.analyser.exceptions.LRSException;


public class TransitionCounterResponse extends AbstractGenericResponse<ActionListResponse.ActionsPerRegistration> {

    public TransitionCounterResponse() {}

    public List<ActionListResponse.ActionsPerRegistration> getResult() {
        return result;
    }

    int[] getStateTransitionCounters() {
        return new int[] {0, 0, 0, 0, 0, 0, 0};
    }

    int[][] getStatesTransitionCounters() {
        return new int[][] {getStateTransitionCounters(),
                getStateTransitionCounters(),
                getStateTransitionCounters(),
                getStateTransitionCounters(),
                getStateTransitionCounters(),
                getStateTransitionCounters(),
                getStateTransitionCounters()};
    }

    public void count(List<int[][]> counters, int step,
                      ActionListResponse.ActionsPerRegistration.SubElement.State previous,
                      ActionListResponse.ActionsPerRegistration.SubElement.State current) {
        // step: starting at 0
        if (step == counters.size()) {
            if (previous==null) {
                // If previous==0, then the previous state is 'init'.
                counters.add(new int[][] {getStateTransitionCounters()});
            } else {
                counters.add(getStatesTransitionCounters());
            }
        }
        final int previousPos = (previous==null)? 0: previous.ordinal();
        counters.get(step)[previousPos][current.ordinal()]++;
    }

    private String getEdgeTitle(int value) {
        final String ret = String.valueOf(value) + " session";
        return (value==1)? ret: ret + "s";
    }

    private void getFirstTransition(JsonArrayBuilder ret, int[][] firstTransition) {
        final JsonArrayBuilder firstLevelTransitions = Json.createArrayBuilder();
        for (int i=0; i<firstTransition[0].length; i++) {
            if (firstTransition[0][i]>0) {
                final JsonObjectBuilder obj = Json.createObjectBuilder();
                obj.add("from", "init");
                obj.add("to", "0:" + i);
                obj.add("value", firstTransition[0][i]);
                obj.add("title", getEdgeTitle(firstTransition[0][i]));
                firstLevelTransitions.add(obj);
            }
        }
        ret.add(firstLevelTransitions);
    }

    private JsonObjectBuilder getEdgeObject(int level, int previousStateOrdinal, int nextStateOrdinal, int value) {
        final JsonObjectBuilder ret = Json.createObjectBuilder();
        ret.add("from", (level-1) + ":" + previousStateOrdinal);
        ret.add("to", level + ":" + nextStateOrdinal);
        ret.add("value", value);
        ret.add("title", getEdgeTitle(value));
        return ret;
    }

    private JsonArrayBuilder getStateTransitionsJson(List<int[][]> transitions) {
        final JsonArrayBuilder ret = Json.createArrayBuilder();
        if (!transitions.isEmpty()) {
            getFirstTransition(ret, transitions.get(0));
            transitions.remove(0);  // Already processed

            int level = 1;
            for (int[][] transitionsInLevel : transitions) {
                final JsonArrayBuilder levelTransitions = Json.createArrayBuilder();
                int previousStateOrdinal = 0;
                for (int[] transitionFromPreviousState: transitionsInLevel) {
                    int nextStateOrdinal=0;
                    for (int value: transitionFromPreviousState) {
                        if (value>0) {
                            levelTransitions.add( getEdgeObject(level, previousStateOrdinal, nextStateOrdinal, value) );
                        }
                        nextStateOrdinal++;
                    }
                    previousStateOrdinal++;
                }
                ret.add(levelTransitions);
                level++;
            }
        }
        return ret;
    }

    @Override
    public JsonObject toJson() throws LRSException {
        final List<int[][]> counters = new ArrayList<int[][]>();

        for (ActionListResponse.ActionsPerRegistration el: this.result) {
            int level = 0;
            ActionListResponse.ActionsPerRegistration.SubElement.State previous = null;
            for (ActionListResponse.ActionsPerRegistration.SubElement sel: el.getStatements()) {
                final ActionListResponse.ActionsPerRegistration.SubElement.State current = sel.getSimplifiedState();
                if (current!=null) {
                    count(counters, level, previous, current);
                    level++;
                }
                previous = current;
            }
            if (previous!=null)
                count(counters, level, previous, ActionListResponse.ActionsPerRegistration.SubElement.State.NOOP);
        }
        if (!counters.isEmpty())
            counters.remove(counters.size()-1);  // Remove last level with only NOOP transitions

        final JsonObjectBuilder ret = Json.createObjectBuilder();
        ret.add("states", ActionListResponse.ActionsPerRegistration.SubElement.getStateJsonArray());
        ret.add("levels", getStateTransitionsJson(counters));
        return ret.build();
    }
}
