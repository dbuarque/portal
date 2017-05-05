/**
 * Created by ISHAI-NOTEBOOK on 7/14/2016.
 */

import {inject, bindable, bindingMode} from 'aurelia-framework';
import {EventHelper, ValidationManager, StellarServer, AppStore} from 'global-resources';
import {AppActionCreators} from '../../../app-action-creators';

@inject(Element, ValidationManager, StellarServer, AppStore, AppActionCreators)
export class IdentifyUserCustomElement {

    @bindable initialMessage;
    @bindable({defaultBindingMode: bindingMode.twoWay}) action;

    alertConfig = {
        dismissible: false
    };

    constructor(element, validationManager, stellarServer, appStore, appActionCreators) {
        this.element = element;
        this.validationManager = validationManager;
        this.stellarServer = stellarServer;
        this.appStore = appStore;
        this.appActionCreators = appActionCreators;
    }

    bind() {
        this.action = this.action || 'login';
        if (this.initialMessage) {
            this.alertConfig.type = this.initialMessage.type;
            this.alertConfig.message = this.initialMessage.text;
        }

        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        this.account = this.appStore.getState().account;
    }

    login() {
        if (!this.validationManager.validate()) {
            return;
        }

        this.loading++;

        this.appStore.dispatch(this.appActionCreators.setAccount(this.publicKey));

        this.loading--;
    }

    authenticate() {
        if (!this.validationManager.validate()) {
            return;
        }

        this.loading++;

        const keyPair = this.stellarServer.sdk.Keypair.fromPublicKey(this.publicKey);

        this.loading--;
    }
}
