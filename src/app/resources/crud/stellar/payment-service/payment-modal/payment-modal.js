/**
 * Created by istrauss on 5/8/2017.
 */

import {inject} from 'aurelia-framework'
import {StellarServer, ValidationManager, AppStore, AlertToaster} from 'global-resources';
import {AppActionCreators} from '../../../../../app-action-creators';

@inject(StellarServer, ValidationManager, AppStore, AlertToaster, AppActionCreators)
export class PaymentModal {

    loading = 0;
    step = 'input';

    constructor(stellarServer, validationManager, appStore, alertToaster, appActionCreators) {
        this.stellarServer = stellarServer;
        this.validationManager = validationManager;
        this.appStore = appStore;
        this.alertToaster = alertToaster;
        this.appActionCreators = appActionCreators
    }

    activate(params) {
        this.nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        this.modalVM = params.modalVM;
        this.code = params.passedInfo.code;
        this.issuer = params.passedInfo.issuer;
        this.memos = params.passedInfo.memos || [];
        this.lockCode = params.passedInfo.lockCode;
        this.lockIssuer = params.passedInfo.lockIssuer;
    }

    addMemo() {
        this.memos.push({});
    }

    removeMemo(index) {
        this.memos.splice(index, 1);
    }

    submitInput() {
        if (!this.validationManager.validate()) {
            return;
        }

        this.alertConfig = {
            type: 'error',
            message: 'Once made, payments are <strong>irreversible</strong>. Please be sure to verify every detail of your payment before confirming. Confirm the details of your payment below. '
        };

        this.step = 'confirm';
    }

    finish() {
        this.modalVM.close();
    }

    refresh() {
        this.destination = undefined;
        this.amount = undefined;
        this.memos = [];
        this.validationManager.clear();
        this.step = 'input';
    }

    async submitConfirmation() {
        this.modalVM.options.dismissible = false;

        this.loading++;

        try {
            //We need to update the account prior to creating the transaction in order to ensure that the account.sequence is updated.
            await this.appStore.dispatch(this.appActionCreators.updateAccount());

            const account = this.appStore.getState().account;

            const transactionBuilder = new this.stellarServer.sdk.TransactionBuilder(
                new this.stellarServer.sdk.Account(account.id, account.sequence)
            );

            //Let's check if the destinationAccount exists.
            let destinationAccount;

            try {
                destinationAccount = await this.stellarServer.loadAccount(this.destination);
            }
                //Rejection means that account does not exist
            catch(e) {}

            //Destination account doest exist? Let's try to create it (if the user is sending native asset).
            if (!destinationAccount) {
                if (this.code === this.nativeAssetCode) {
                    transactionBuilder
                        .addOperation(this.stellarServer.sdk.Operation.createAccount({
                            destination: this.destination,
                            startingBalance: "20"
                        }));

                    this.amount = parseInt(this.amount, 10) - 20;
                }
                else {
                    this.alertToaster.error('That destination account does not exist on the stellar network. Please ensure that you are sending this payment to an existing account.');
                    return;
                }
            }

            //Add the payment operation
            transactionBuilder
                .addOperation(
                    this.stellarServer.sdk.Operation.payment({
                        destination: this.destination,
                        amount: this.amount.toString(),
                        asset: this.code === this.nativeAssetCode ?
                            this.stellarServer.sdk.Asset.native() :
                            new this.stellarServer.sdk.Asset(this.code, this.issuer)
                    })
                );

            //Attach the memos
            this.memos.forEach(m => {
                transactionBuilder.addMemo(this.stellarServer.sdk.Memo[this.memoMethodFromType(m.type)](m.value))
            });

            const transaction = transactionBuilder.build();

            this.modalVM.close(transaction);
        }
        catch(e) {
            this.alertToaster.error(e.message || 'Something is wrong!');
            this.loading--;
            this.modalVM.options.dismissible = true;
        }
    }

    memoMethodFromType(memoType) {
        switch (memoType) {
            case 'Id':
                return 'id';
            case 'Text':
                return 'text';
            case 'Hash':
                return 'hash';
            case 'Return':
                return 'returnHash';
            default:
                throw new Error('Unrecognized Memo Type.');
        }
    }
}
