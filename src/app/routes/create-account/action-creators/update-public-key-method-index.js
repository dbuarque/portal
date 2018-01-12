import {actionCreator} from 'aurelia-redux-connect';
import {UPDATE_PUBLIC_KEY_METHOD_INDEX} from '../create-account.action-types';

@actionCreator()
export class UpdatePublicKeyMethodIndexActionCreator {
    create(newIndex) {
        return {
            type: UPDATE_PUBLIC_KEY_METHOD_INDEX,
            payload: parseInt(newIndex, 10)
        };
    }
}
