import {bindable, inject} from 'aurelia-framework';
import {ValidationManager, StellarServer} from 'global-resources';
import {Store} from 'au-redux';
import {SecretStore} from "app-resources";

@inject(ValidationManager, StellarServer, Store, SecretStore)
export class SignWithProvidedSecretCustomElement {

    @bindable() transactionSigned;
    @bindable() transaction;

    constructor(validationManager, stellarServer, store, secretStore) {
        this.validationManager = validationManager;
        this.stellarServer = stellarServer;
        this.secretStore = store;
        this.secretStore = secretStore;
    }

    activate(params) {
        this.modalVM = params.modalVM;
    }

    sign() {
        if (!this.validationManager.validate()) {
            return;
        }

        const keypair = this.stellarServer.sdk.Keypair.fromSecret(this.secret);
        const account = this.store.getState().myAccount;

        if (!account) {
            this.errorMessage = 'Hey, you aren\'t logged in. You can\'t create a transaction without being logged in first silly. Please login and try again.'
            return;
        }

        if (!keypair) {
            this.errorMessage = 'That is not a valid secret key';
            return;
        }

        if (keypair.publicKey() !== account.accountId) {
            this.errorMessage = 'That secret key is incorrect. Please check carefully, are you sure this is the secret key for the logged in account?';
            return;
        }

        if (this.remember) {
            this.secretStore.remember(
                keypair
            );
        }

        this.transactionSigned(
            this.transaction.sign(keypair)
        );
    }
}
