import {inject, computedFrom} from 'aurelia-framework';
import {Store, connected} from 'aurelia-redux-connect';
import {UpdatePublicKeyMethodIndexActionCreator} from '../../action-creators';

@inject(UpdatePublicKeyMethodIndexActionCreator)
export class ChoosePublicKeyMethod {
    @computedFrom('availableMethods', 'methodIndex')
    get method() {
        return this.availableMethods[this.methodIndex];
    }

    @connected('createAccount.publicKeyMethodIndex')
    get methodIndex() {}
    set methodIndex(newIndex) {
        this.updatePublicKeyMethodIndex.dispatch(newIndex);
    }

    get availableMethods() {
        return this.store.getState().createAccount.publicKeyMethods;
    }

    constructor(store, updatePublicKeyMethodIndex) {
        this.store = store;
        this.updatePublicKeyMethodIndex = updatePublicKeyMethodIndex;
    }
}
