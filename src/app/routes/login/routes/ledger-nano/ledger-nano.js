import {inject} from 'aurelia-framework';
import {Store, connected} from 'au-redux';
import StellarLedger from 'stellar-ledger-api';
import {ValidationManager} from 'global-resources';
import {SecretStore} from 'app-resources';
import {UpdateAccountActionCreator, UpdateBip32PathActionCreator} from '../../../../action-creators';

@inject(Store, ValidationManager, SecretStore, UpdateAccountActionCreator, UpdateBip32PathActionCreator)
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
    ledgerConnected = false;

    constructor(store, validationManager, secretStore, updateAccount, updateBip32Path) {
        this.store = store;
        this.validationManager = validationManager;
        this.secretStore = secretStore;
        this.updateAccount = updateAccount;
        this.updateBip32Path = updateBip32Path;
    }

    connectLedger() {
        const self = this;

        self.loading++;

        const Comm = StellarLedger.comm;
        new StellarLedger.Api(
            new Comm(Number.MAX_VALUE)
        )
            .connect(() => {
                self.ledgerConnected = true;
                self.loading--;
            }, (err) => {
                console.warn('Error connecting Ledger');
                console.warn(err);
                self.ledgerConnectionFailed = true;
                self.loading--;
            });
    }

    async getPublicKeyFromLedger() {
        const Comm = StellarLedger.comm;

        return new StellarLedger.Api(
            new Comm(5)
        )
            .getPublicKey_async(this.bip32Path, true, true)
            .then((result) => {
                return result.publicKey;
            })
            .catch((err) => {
                console.error('Error getting public key from Ledger');
                console.error(err);
                return null;
            });
    }

    async login() {
        this.loading++;

        if (this.ledgerConnected) {
            this.publicKey = await this.getPublicKeyFromLedger();
        }

        if (!this.publicKey) {
            this.errorMessage = 'The public key you entered is invalid.';
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
