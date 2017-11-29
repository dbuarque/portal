/**
 * Created by istrauss on 6/29/2017.
 */

import * as StellarSdk from 'stellar-sdk';
import {computedFrom, inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {AlertToaster} from 'global-resources';
import {SecretStore} from 'app-resources';
import {UpdateAccountActionCreator} from '../../../action-creators';
import StellarLedger from 'stellar-ledger-api';

@inject(Store, AlertToaster, SecretStore, UpdateAccountActionCreator)
export class LoginCustomElement {

    loading = 0;

    @computedFrom('_publicKey')
    get publicKey() {
        return this._publicKey;
    }
    set publicKey(newValue) {
        this._publicKey = newValue;

        const keypair = this._secretKey ? StellarSdk.Keypair.fromSecret(this._secretKey) : undefined;

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

        const keypair = this._secretKey ? StellarSdk.Keypair.fromSecret(this._secretKey) : undefined;
        this._publicKey = keypair ? keypair.publicKey() : undefined;
    }

    get bip32Path() {
        return this._bip32Path;
    }
    set bip32Path(newValue) {
        this._bip32Path = newValue;
    }

    get ledgerConnected() {
        return this._ledgerConnected;
    }

    connectLedger() {
        new StellarLedger.Api(new StellarLedger.comm(Number.MAX_VALUE))
            .connect(() => {
                this._ledgerConnected = true;
            }, (err) => {
                console.log('Error connecting Ledger');
                console.log(err);
            });
    }

    constructor(store, alertToaster, secretStore, updateAccount) {
        this.store = store;
        this.alertToaster = alertToaster;
        this.secretStore = secretStore;
        this.updateAccount = updateAccount;
        this._ledgerConnected = false;
        this._bip32Path = "44'/148'/0'";
        this.connectLedger();
    }

    async login() {
        if (this._ledgerConnected) {
            let self = this;
            await new StellarLedger.Api(new StellarLedger.comm(5))
                .getPublicKey_async(this._bip32Path, true, true)
                .then((result) => {
                    self._publicKey = result.publicKey;
            }).catch((err) => {
                console.log('Error getting public key from Ledger');
                console.log(err);
            });
        }
        if (!this.publicKey) {
            this.alertToaster.error('You must enter either a valid account address or valid secret key to login.');
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
                this.secretStore.remember(StellarSdk.Keypair.fromSecret(this.secretKey));
            }
        }

        this.loading--;
    }

}
