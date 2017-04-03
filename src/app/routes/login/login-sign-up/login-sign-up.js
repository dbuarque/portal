/**
 * Created by ISHAI-NOTEBOOK on 7/14/2016.
 */

import {inject, bindable, bindingMode} from 'aurelia-framework';
import {EventHelper, ValidationManager, StellarServer} from 'resources';

@inject(Element, ValidationManager, StellarServer)
export class LoginSignUpCustomElement {

    @bindable initialMessage;
    @bindable({defaultBindingMode: bindingMode.twoWay}) action;
    mode = 'public';

    alertConfig = {
        dismissible: false
    };

    constructor(element, validationManager, stellarServer) {
        this.element = element;
        this.validationManager = validationManager;
        this.stellarServer = stellarServer;
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

        const keyPair = this.stellarServer.sdk.Keypair.fromPublicKey(this.publicKey);
    }
}
