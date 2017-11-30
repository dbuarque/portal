import {bindable, inject} from 'aurelia-framework';
import * as StellarSdk from 'stellar-sdk';
import {ValidationManager} from 'global-resources';
import {Store} from 'au-redux';
import {SecretStore} from 'app-resources';

@inject(ValidationManager, Store, SecretStore)
export class SignWithProvidedSecretCustomElement {

    @bindable() transactionSigned;
    @bindable() transaction;
    @bindable() back;

    rememberExplanation = 'By default, we will not store your secret key at all. ' +
        'After it is used to sign a transaction, it will immediately be forgotten. ' +
        'Checking "Remember Secret" will allow us to store your secret in the browser\'s memory ' +
        'so you can create additional transactions without entering it again. Even when you select this option, ' +
        'we do not store it anywhere but in the memory of the browser. As soon as you close or refresh this tab, the secret will be forgotten.';

    constructor(validationManager, store, secretStore) {
        this.validationManager = validationManager;
        this.store = store;
        this.secretStore = secretStore;
    }

    sign() {
        if (!this.validationManager.validate()) {
            return;
        }

        const keypair = StellarSdk.Keypair.fromSecret(this.secret);
        const account = this.store.getState().myAccount;

        if (!account) {
            this.errorMessage = 'Hey, you aren\'t logged in. You can\'t create a transaction without being logged in first silly. Please login and try again.';
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

        this.transaction.sign(keypair);

        this.transactionSigned({
            signedTransaction: this.transaction
        });
    }
}
