/**
 * Created by ISHAI-NOTEBOOK on 7/14/2016.
 */

import {inject, bindable, bindingMode} from 'aurelia-framework';
import {EventHelper, ValidationManager, StellarServer} from 'resources';
import {AppActionCreators} from '../../../app-action-creators';

@inject(Element, ValidationManager, StellarServer, AppActionCreators)
export class IdentifyUserCustomElement {

    @bindable initialMessage;
    @bindable({defaultBindingMode: bindingMode.twoWay}) action;

    alertConfig = {
        dismissible: false
    };

    constructor(element, validationManager, stellarServer, appActionCreators) {
        this.element = element;
        this.validationManager = validationManager;
        this.stellarServer = stellarServer;
        this.appActionCreators = appActionCreators;
    }

    bind() {
        this.action = this.action || 'login';
        if (this.initialMessage) {
            this.alertConfig.type = this.initialMessage.type;
            this.alertConfig.message = this.initialMessage.text;
        }
    }

    login() {
        if (!this.validationManager.validate()) {
            return;
        }

        this.loading++;

        this.appStore.dispatch(this.appActionCreators.updateAccount(this.publicKey));

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
