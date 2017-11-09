/**
 * Created by istrauss on 6/29/2017.
 */

import {computedFrom, inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {StellarServer, AlertToaster} from 'global-resources';
import {SecretStore} from 'app-resources';
import {UpdateAccountActionCreator} from '../../../action-creators';

@inject(Store, StellarServer, AlertToaster, SecretStore, UpdateAccountActionCreator)
export class LoginCustomElement {

    loading = 0;

    @computedFrom('_publicKey')
    get publicKey() {
        return this._publicKey;
    }
    set publicKey(newValue) {
        this._publicKey = newValue;

        const keypair = this._secretKey ? this.stellarServer.sdk.Keypair.fromSecret(this._secretKey) : undefined;

        if (!keypair || keypair.publicKey() !== this._publicKey) {
            this._secretKey = undefined;
        }
    }

    @computedFrom('_secretKey')
    get secretKey() {
        return this._secretKey;
    }
    set secretKey(newValue) {
        this._secretKey = newValue;

        const keypair = this._secretKey ? this.stellarServer.sdk.Keypair.fromSecret(this._secretKey) : undefined;
        this._publicKey = keypair ? keypair.publicKey() : undefined;
    }

    constructor(store, stellarServer, alertToaster, secretStore, updateAccount) {
        this.store = store;
        this.stellarServer = stellarServer;
        this.alertToaster = alertToaster;
        this.secretStore = secretStore;
        this.updateAccount = updateAccount;
    }

    async login() {
        if (!this.publicKey) {
            this.alertToaster.error('You must enter either a valid account address or valid secret key to login.')
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
            if (this.secretKey) {
                this.secretStore.remember(this.stellarServer.sdk.Keypair.fromSecret(this.secretKey));
            }
        }

        this.loading--;
    }
}
