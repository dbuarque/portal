/**
 * Created by Ishai on 12/21/2016.
 */

export default class ReducerHelper {

    /**
     * Utility method to update an array with no in-place mutation.
     * @param {Array} arr - the array to be updated
     * @param {Object[]} updates
     * @param {number} updates.index
     * @param {Object} updates.values
     */
    static updateArray(arr, updates = []) {
        return updates.reduce((_arr, update) => {
            const arrElemToUpdate = arr[update.index];
            const newArrElem = {
                ...arrElemToUpdate,
                ...update.values
            };
            return _arr.slice(0, update.index).concat(newArrElem).concat(_arr.slice(update.index + 1));
        }, arr.slice(0));
    }

    /**
     * Produces a reducer by combining reducers just like the native redux.combineReducers while providing rootState to each reducer.
     * @param fnsByName
     * @returns {Function}
     */
    static combineReducersProvideRootState(fnsByName) {
        return (state = {}, action, rootState) => {
            const modifications = Object.keys(fnsByName).reduce((_newState, fnName) => {
                return {
                    ..._newState,
                    [fnName]: fnsByName[fnName](state[fnName], action, rootState || state)
                };
            }, {});

            return {
                ...state,
                ...modifications
            }
        }
    }

    /**
     * Produces a reducer by combining reducers in series.
     * @param {function[]} reducers
     * @returns {Function}
     */
    static seriesReducer(reducers) {
        return (state, action, rootState) => {
            return reducers.reduce((_state, reducer) => reducer(_state, action, rootState), state);
        }
    }

    /**
     * Creates a reducer wrapper function that only executes the reducer if the action.type begins with the namespace.
     * @param reducer
     * @param namespace
     * @returns {Function}
     */
    static restrictReducerToNamespace(reducer, namespace) {
        return function (...rest) {
            const state = rest[0];
            const action = rest[1];

            if (state && action.type.indexOf(namespace) !== 0) {
                return state;
            }

            return reducer(...rest);
        }
    }
}
