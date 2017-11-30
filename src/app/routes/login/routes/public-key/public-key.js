import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {UpdateAccountActionCreator} from '../../../../action-creators';

@inject(Store, UpdateAccountActionCreator)
export class PublicKey {
    loading = 0;
    publicKey;

    constructor(store, updateAccount) {
        this.store = store;
        this.updateAccount = updateAccount;
    }

    async login() {
        if (!this.publicKey) {
            this.errorMessage = 'The public key you entered is invalid.';
            return;
        }

        this.loading++;

        await this.updateAccount.dispatch(this.publicKey);

        if (!this.store.getState().myAccount) {
            this.errorMessage = 'That account could not be found on the stellar network. Are you sure the account exists?';
        }

        this.loading--;
    }
}
