import * as StellarSdk from 'stellar-sdk';
import {inject, computedFrom} from 'aurelia-framework';
import {ValidationRules, ValidationController, validateTrigger} from 'aurelia-validation';
import {Store} from 'aurelia-redux-connect';
import {SecretStore} from 'app-resources';
import {UpdateAccountActionCreator} from '../../../../action-creators';

@inject(ValidationController, Store, SecretStore, UpdateAccountActionCreator)
export class PublicKey {
    @computedFrom('_secretKey')
    get secretKey() {
        return this._secretKey;
    }
    set secretKey(newValue) {
        this._secretKey = newValue;

        try {
            const keypair = this._secretKey ? StellarSdk.Keypair.fromSecret(this._secretKey) : undefined;
            this.publicKey = keypair ? keypair.publicKey() : undefined;
        }
        catch (e) {}
    }

    loading = 0;

    constructor(validationController, store, secretStore, updateAccount) {
        this.validationController = validationController;
        this.store = store;
        this.secretStore = secretStore;
        this.updateAccount = updateAccount;

        this.configureValidation();
    }

    configureValidation() {
        this.validationController.validateTrigger = validateTrigger.blur;

        ValidationRules
            .ensure('secretKey')
            .required()
            .on(this);
    }

    async login() {
        const validationResult = await this.validationController.validate();
        if (!validationResult.valid) {
            return;
        }

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
