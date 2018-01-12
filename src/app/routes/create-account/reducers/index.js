import {combineReducers} from 'redux';
import {restrictReducerToNamespace} from 'aurelia-redux-connect';
import {namespace} from '../create-account.action-types';
import {stepIndex} from './step-index';
import {publicKeyMethods} from './public-key-methods';
import {publicKeyMethodIndex} from './public-key-method-index';
import {publicKey} from './public-key';

export const createAccount = restrictReducerToNamespace(
    combineReducers({
        stepIndex,
        publicKey,
        publicKeyMethods,
        publicKeyMethodIndex
    }),
    namespace
);
