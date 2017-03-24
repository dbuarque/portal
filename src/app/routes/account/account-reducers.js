/**
 * Created by istrauss on 1/4/2017.
 */

import {ReducerHelper} from 'resources';
import {namespace, accountActionTypes} from './account-action-types';

//const {} = accountActionTypes;

let _account = ReducerHelper.combineReducersProvideRootState({});

export const account = ReducerHelper.restrictReducerToNamespace(_account, namespace);
