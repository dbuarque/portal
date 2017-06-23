/**
 * Created by ISHAI-NOTEBOOK on 7/14/2016.
 */

import {inject, bindable, bindingMode, computedFrom} from 'aurelia-framework';
import {EventHelper, ValidationManager, StellarServer, AppStore} from 'global-resources';
import {AppActionCreators} from '../../../app-action-creators';

@inject(Element, ValidationManager, StellarServer, AppStore, AppActionCreators)
export class IdentifyUserCustomElement {

    @bindable initialMessage;
    @bindable({defaultBindingMode: bindingMode.twoWay}) action;

    rememberExplanation = 'By default, we will not store your secret key at all ' +
        '(after it is used to sign a transaction, it will immediately be forgotten). ' +
        'Checking "Remember Secret" will allow us to store your secret in the browser\'s memory ' +
        'so you can create additional transactions without authenticating again. Even when you select this option, ' +
        'we do not store it anywhere but in the memory of the browser. As soon as you refresh this tab, the secret will be forgotten.';

    changellyAlertConfig = {
        type: 'info',
        message: 'After you record the keypair above (ensuring that the secret is stored securely), you can use our partners at Changelly to fund your new stellar account.' +
            ' Stellar will not actually create your account until you fund it with ' + window.lupoex.stellar.nativeAssetCode + '. To fund your stellar account, use the button below.',
        dismissible: false
    };

    createAccountHelpAlertConfig = {
        type: 'info',
        message: 'Want some extra help creating your stellar account? Check out our in depth guide to <a href="http://docs.lupoex.com/getting-started/create-an-account/" target="_blank">creating a stellar account</a>.',
        dismissible: false
    };

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
        else if (this.action === 'authenticate') {
            this.alertConfig = {
                type: 'info',
                message: 'In order to perform any operation (i.e. send a payment, create an offer etc.) on the stellar network, ' +
                'you need to sign with your account\'s secret key. Please provide your secret key below. ' +
                'Have no fear, your secret key will not leave the browser (we just store it in memory for the signing). As soon as you close this tab, ' +
                'refresh this tab or logout, your secret key will be forgotten from the browser\'s memory.'
            }
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

    async login() {
        if (!this.validationManager.validate()) {
            return;
        }

        this.loading++;

        try {
            await this.appStore.dispatch(this.appActionCreators.setAccount(this.publicKey));

            EventHelper.emitEvent(this.element, 'login');
        }
        catch(e) {
            this.alertConfig = {
                type: 'error',
                message: 'That account could not be found on the stellar network. Are you sure the account exists?'
            };
        }

        this.loading--;
    }

    generateKeypair() {
        this.newKeypair = this.stellarServer.sdk.Keypair.random();
        this.newPublicKey = this.newKeypair.publicKey();
        this.newSecret = this.newKeypair.secret();
    }

    authenticate() {
        if (!this.validationManager.validate()) {
            return;
        }

        EventHelper.emitEvent(this.element, 'secret', {
            detail: {
                secret: this.secret,
                remember: this.remember
            }
        });
    }

    @computedFrom('newSecret')
    get hiddenNewSecret() {
        return this.newSecret ? this.newSecret.split('').map(l => 'x').join('') : '';
    }
}
