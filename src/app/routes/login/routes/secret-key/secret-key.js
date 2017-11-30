import * as StellarSdk from 'stellar-sdk';
import {inject, computedFrom} from 'aurelia-framework';
import {Store} from 'au-redux';
import {SecretStore} from 'app-resources';
import {UpdateAccountActionCreator} from '../../../../action-creators';

@inject(Store, SecretStore, UpdateAccountActionCreator)
export class PublicKey {
    @computedFrom('_secretKey')
    get secretKey() {
        return this._secretKey;
    }
    set secretKey(newValue) {
        this._secretKey = newValue;

        const keypair = this._secretKey ? StellarSdk.Keypair.fromSecret(this._secretKey) : undefined;
        this.publicKey = keypair ? keypair.publicKey() : undefined;
    }

    loading = 0;

    constructor(store, secretStore, updateAccount) {
        this.store = store;
        this.secretStore = secretStore;
        this.updateAccount = updateAccount;
    }

    async login() {
        if (!this.publicKey) {
            this.errorMessage = 'The secret key you entered is invalid.';
            return;
        }

        this.loading++;

        await this.updateAccount.dispatch(this.publicKey);

        if (!this.store.getState().myAccount) {
            this.errorMessage = 'That account could not be found on the stellar network. Are you sure the account exists?';
        }
        else {
            this.secretStore.remember(StellarSdk.Keypair.fromSecret(this.secretKey));
        }

        this.loading--;
    }
}
