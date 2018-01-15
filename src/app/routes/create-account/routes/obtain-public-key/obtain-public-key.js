import {inject} from 'aurelia-framework';
import {connected, Store} from 'aurelia-redux-connect';
import {UpdateCanProceedActionCreator, UpdatePublicKeyActionCreator} from '../../action-creators';

@inject(Store, UpdateCanProceedActionCreator, UpdatePublicKeyActionCreator)
export class ObtainPublicKey {
    get method() {
        const state = this.store.getState().createAccount;
        return state.publicKeyMethods[state.publicKeyMethodIndex];
    }

    @connected('createAccount.publicKey')
    get publicKey() {}
    set publicKey(newKey) {
        this.updatePublicKey.dispatch(newKey);
    }

    @connected('createAccount.canProceed')
    get canProceed() {}
    set canProceed(newValue) {
        this.updateCanProceed.dispatch(newValue);
    }

    constructor(store, updateCanProceed, updatePublicKey) {
        this.store = store;
        this.updateCanProceed = updateCanProceed;
        this.updatePublicKey = updatePublicKey;
    }

    activate() {
        this.canProceed = !!this.publicKey;
    }
}
