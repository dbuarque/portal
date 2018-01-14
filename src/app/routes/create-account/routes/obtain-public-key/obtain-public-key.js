import {inject, computedFrom} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {UpdateCanProceedActionCreator, UpdatePublicKeyActionCreator} from '../../action-creators';

@inject(UpdateCanProceedActionCreator, UpdatePublicKeyActionCreator)
export class ObtainPublicKey {
    @computedFrom('availableMethods', 'methodIndex')
    get method() {
        return this.availableMethods[this.methodIndex];
    }

    @connected('createAccount.publicKeyMethodIndex')
    methodIndex;

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

    constructor(updateCanProceed, updatePublicKey) {
        this.updateCanProceed = updateCanProceed;
        this.updatePublicKey = updatePublicKey;
    }

    activate() {
        this.canProceed = !!this.publicKey;
    }
}
