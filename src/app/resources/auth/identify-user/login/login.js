/**
 * Created by istrauss on 6/29/2017.
 */

import _throttle from 'lodash.throttle';
import {bindable, inject} from 'aurelia-framework';
import {EventHelper, ValidationManager, AppStore, ObserverManager, ObservationInstruction, StellarServer} from 'global-resources';
import {SecretStore} from 'app-resources';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(ValidationManager, AppStore, ObserverManager, StellarServer, SecretStore, AppActionCreators)
export class LoginCustomElement {

    @bindable parentElement;

    constructor(validationManager, appStore, observerManager, stellarServer, secretStore, appActionCreators) {
        this.validationManager = validationManager;
        this.appStore = appStore;
        this.observerManager = observerManager;
        this.stellarServer = stellarServer;
        this.secretStore = secretStore;
        this.appActionCreators = appActionCreators;

        this.onPublicKeyChange = _throttle(this._onPublicKeyChange.bind(this), 250);
        this.onSecretChange = _throttle(this._onSecretChange.bind(this), 250);
    }

    subscribeObservers() {
        const instructions = [
            new ObservationInstruction(this, 'publicKey', this.onPublicKeyChange.bind(this))
        ]
    }

    _onPublicKeyChange() {
        if (!this.secretAndPublicAreEqual) {
            this.secret = undefined;
        }
    }

    _onSecretChange() {
        if (!this.secretAndPublicAreEqual) {
            this.publicKey = this.stellarServer.sdk.Keypair.fromSecret(this.secret).publicKey();
        }
    }

    get secretAndPublicAreEqual() {
        if (this.secret) {
            const keypair = this.stellarServer.sdk.Keypair.fromSecret(this.secret);
            return keypair.publicKey() === this.publicKey;
        }

        return !this.publicKey;
    }

    async login() {
        if (!this.validationManager.validate()) {
            return;
        }

        if (this.secret && this.publicKey && !this.secretAndPublicAreEqual) {
            return;
        }

        this.loading++;

        try {
            await this.appStore.dispatch(this.appActionCreators.setAccount(this.publicKey));

            if (this.secret) {
                this.secretStore.remember(this.stellarServer.sdk.Keypair.fromSecret(this.secret));
            }

            EventHelper.emitEvent(this.parentElement, 'login');
        }
        catch(e) {
            this.alertConfig = {
                type: 'error',
                message: 'That account could not be found on the stellar network. Are you sure the account exists?'
            };
        }

        this.loading--;
    }
}