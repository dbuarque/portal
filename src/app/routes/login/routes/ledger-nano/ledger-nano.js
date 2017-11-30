import {inject} from 'aurelia-framework';
import {Store, connected} from 'au-redux';
import {ValidationManager} from 'global-resources';
import {SecretStore, LedgerHwService} from 'app-resources';
import {UpdateAccountActionCreator, UpdateBip32PathActionCreator} from '../../../../action-creators';

@inject(Store, ValidationManager, SecretStore, LedgerHwService, UpdateAccountActionCreator, UpdateBip32PathActionCreator)
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

    constructor(store, validationManager, secretStore, ledgerHwService, updateAccount, updateBip32Path) {
        this.store = store;
        this.validationManager = validationManager;
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

        if (this.ledgerConnected) {
            this.publicKey = await this.ledgerHwService.getPublicKeyFromLedger(this.bip32Path);
        }

        if (!this.publicKey) {
            this.errorMessage = 'Something is wrong, a valid stellar account could not be detected.';
            this.loading--;
            return;
        }

        await this.updateAccount.dispatch(this.publicKey);

        if (!this.store.getState().myAccount) {
            this.errorMessage = 'That account could not be found on the stellar network. Are you sure the account exists?';
        }

        this.loading--;
    }
}
