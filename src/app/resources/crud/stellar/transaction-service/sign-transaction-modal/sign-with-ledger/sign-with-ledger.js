import {bindable, inject} from 'aurelia-framework';
import * as StellarSdk from 'stellar-sdk';
import {Store} from 'aurelia-redux-connect';
import StellarLedger from 'stellar-ledger-api';
import {LedgerHwService} from '../../../ledger-hw-service';

@inject(Store, LedgerHwService)
export class SignWithLedgerCustomElement {
    @bindable() transactionSigned;
    @bindable() transaction;
    @bindable() back;

    loading = 0;
    ledgerConnected;

    constructor(store, ledgerHwService) {
        this.store = store;
        this.ledgerHwService = ledgerHwService;
    }

    bind(params) {
        this.connectLedger();
    }

    async connectLedger() {
        this.loading++;
        this.ledgerConnected = await this.ledgerHwService.connectLedger();
        this.loading--;
    }

    async sign() {
        const account = this.store.getState().myAccount;
        const bip32Path = this.store.getState().bip32Path;

        if (!account) {
            this.errorMessage = 'Hey, you aren\'t logged in. You can\'t create a transaction without being logged in first silly. Please login and try again.';
            return;
        }

        const ledgerPublicKey = await this.ledgerHwService.getPublicKeyFromLedger(bip32Path);

        if (ledgerPublicKey !== account.accountId) {
            this.errorMessage = 'Something is wrong, your current logged in account does not match the account being accessed from the ledger device. Please log out and log back in using your ledger device.';
            return;
        }

        const keypair = StellarSdk.Keypair.fromPublicKey(account.accountId);
        const Comm = StellarLedger.comm;

        await new StellarLedger.Api(
            new Comm(60)
        )
            .signTx_async(bip32Path, this.transaction)
            .then((result) => {
                this.transaction.signatures.push(
                    new StellarSdk.xdr.DecoratedSignature({
                        hint: keypair.signatureHint(),
                        signature: result.signature
                    })
                );

                this.transactionSigned({
                    signedTransaction: this.transaction
                });
            })
            .catch((err) => {
                console.error(err);
                this.errorMessage = err;
            });
    }
}
