/**
 * Created by istrauss on 1/4/2017.
 */

import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {namespace, accountActionTypes} from './account-action-types';

//const {} = accountActionTypes;

let _account = combineReducersProvideRootState({});

export const account = restrictReducerToNamespace(_account, namespace);
