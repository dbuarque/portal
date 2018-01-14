import {inject, computedFrom} from 'aurelia-framework';
import {Store, connected} from 'aurelia-redux-connect';
import {UpdatePublicKeyMethodIndexActionCreator, UpdateCanProceedActionCreator} from '../../action-creators';

@inject(Store, UpdatePublicKeyMethodIndexActionCreator, UpdateCanProceedActionCreator)
export class ChoosePublicKeyMethod {
    @computedFrom('availableMethods', 'methodIndex')
    get method() {
        return this.availableMethods[this.methodIndex];
    }

    @connected('createAccount.publicKeyMethodIndex')
    get methodIndex() {}
    set methodIndex(newIndex) {
        this.updatePublicKeyMethodIndex.dispatch(
            parseInt(newIndex, 10)
        );
    }

    get availableMethods() {
        return this.store.getState().createAccount.publicKeyMethods;
    }

    constructor(store, updatePublicKeyMethodIndex, updateCanProceed) {
        this.store = store;
        this.updatePublicKeyMethodIndex = updatePublicKeyMethodIndex;
        this.updateCanProceed = updateCanProceed;
    }

    activate() {
        this.updateCanProceed.dispatch(true);
    }
}
