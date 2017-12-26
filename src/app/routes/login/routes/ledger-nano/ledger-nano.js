import {inject} from 'aurelia-framework';
import {Store, connected} from 'aurelia-redux-connect';
import {SecretStore, LedgerHwService} from 'app-resources';
import {UpdateAccountActionCreator, UpdateBip32PathActionCreator} from '../../../../action-creators';

@inject(Store, SecretStore, LedgerHwService, UpdateAccountActionCreator, UpdateBip32PathActionCreator)
export class PublicKey {
    @connected('bip32Path')
    get bip32Path() {
        // getter will be set by @connected
    }
    set bip32Path(newValue) {
        this.updateBip32Path.dispatch(newValue);
    }

    loading = 0;
    publicKey;
    ledgerConnected;

    constructor(store, secretStore, ledgerHwService, updateAccount, updateBip32Path) {
        this.store = store;
        this.secretStore = secretStore;
        this.ledgerHwService = ledgerHwService;
        this.updateAccount = updateAccount;
        this.updateBip32Path = updateBip32Path;
    }

    async connectLedger() {
        this.loading++;
        this.ledgerConnected = await this.ledgerHwService.connectLedger();
        this.loading--;
    }

    async login() {
        this.loading++;

        if (!this.publicKey) {
            return;
        }

        await this.updateAccount.dispatch(this.publicKey);

        if (!this.store.getState().myAccount) {
            this.errorMessage = 'That account could not be found on the stellar network. Are you sure the account exists?';
        }

        this.loading--;
    }
}
