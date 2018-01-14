import {actionCreator} from 'aurelia-redux-connect';
import {UPDATE_PUBLIC_KEY} from '../create-account.action-types';

@actionCreator()
export class UpdatePublicKeyActionCreator {
    create(newKey) {
        return {
            type: UPDATE_PUBLIC_KEY,
            payload: newKey
        };
    }
}
