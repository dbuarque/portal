/**
 * Created by istrauss on 6/29/2017.
 */

import _throttle from 'lodash/throttle';
import {bindable, inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {EventHelper, StellarServer, AlertToaster} from 'global-resources';
import {SecretStore} from 'app-resources';
import {UpdateAccountActionCreator} from '../../../../action-creators';

@inject(Store, StellarServer, AlertToaster, SecretStore, UpdateAccountActionCreator)
export class LoginCustomElement {

    @bindable parentElement;

    loading = 0;

    constructor(store, stellarServer, alertToaster, secretStore, updateAccount) {
        this.store = store;
        this.stellarServer = stellarServer;
        this.alertToaster = alertToaster;
        this.secretStore = secretStore;
        this.updateAccount = updateAccount;

        this.onPublicKeyChange = _throttle(this._onPublicKeyChange.bind(this), 250);
        this.onSecretChange = _throttle(this._onSecretChange.bind(this), 250);
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
        if (!this.publicKey) {
            this.alertToaster.error('You must enter either a valid account address or valid secret key to login.')
        }

        if (this.secret && this.publicKey && !this.secretAndPublicAreEqual) {
            return;
        }

        this.loading++;

        await this.updateAccount.dispatch(this.publicKey);

        if (!this.store.getState().myAccount) {
            this.alertConfig = {
                type: 'error',
                message: 'That account could not be found on the stellar network. Are you sure the account exists?'
            };
        }
        else {
            if (this.secret) {
                this.secretStore.remember(this.stellarServer.sdk.Keypair.fromSecret(this.secret));
            }

            EventHelper.emitEvent(this.parentElement, 'login');
        }

        this.loading--;
    }
}
