/**
 * Created by istrauss on 5/19/2017.
 */

import './send-payment.scss';
import * as StellarSdk from 'stellar-sdk';
import {inject, computedFrom} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {connected} from 'aurelia-redux-connect';
import {ModalService, ValidationManager} from 'global-resources';
import {AccountResource, TransactionService} from 'app-resources';

@inject(Router, ModalService, ValidationManager, AccountResource, TransactionService)
export class SendPayment {
    @connected('myAccount')
    account;

    loading = 0;
    step = 'input';

    @computedFrom('type')
    get isNative() {
        return this.type.toLowerCase() === 'native';
    }

    constructor(router, modalService, validationManager, accountResource, transactionService) {
        this.router = router;
        this.modalService = modalService;
        this.validationManager = validationManager;
        this.accountResource = accountResource;
        this.transactionService = transactionService;

        this.lupoexPublicKey = window.lupoex.publicKey;
    }

    activate(params) {
        this.type = params.type;
        this.code = params.code;
        this.issuer = params.issuer;
        this.destination = params.destination;
    }

    accountChanged() {
        if (!this.account) {
            this.router.parent.navigateToRoute('exchange');
        }
    }

    addMemo() {
        this.memo = {};
    }

    removeMemo(index) {
        this.memo = undefined;
    }

    submitInput() {
        if (!this.validationManager.validate()) {
            return;
        }

        if (this.requiredMemo) {
            this.memo = {
                type: this.memoTypeTitle(this.requiredMemoType),
                value: this.requiredMemo
            };
        }

        this.step = 'confirm';
    }

    tryAgain() {
        this.alertConfig = undefined;
        this.step = 'input';
    }

    refresh() {
        this.amount = undefined;
        this.memo = undefined;
        this.validationManager.clear();
        this.step = 'input';
        this.alertConfig = undefined;
    }

    async submitConfirmation() {
        this.loading++;

        try {
            //Let's check if the destinationAccount exists.
            let destinationAccount;

            try {
                destinationAccount = await this.accountResource.account(this.destination, {
                    handleError: false
                });
            }
            catch (e) {
                //failure means that the destinationAccount doesn't exist.
            }

            let operations = [];

            //Destination account doest exist? Let's try to create it (if the user is sending native asset).
            if (!destinationAccount) {
                if (this.isNative) {
                    const mimimumAmount = window.lupoex.stellar.minimumNativeBalance + 1;

                    if (parseInt(this.amount, 10) < mimimumAmount) {
                        this.alertConfig = {
                            type: 'error',
                            message: 'That destination account does not exist. We cannot create the account with less than ' + mimimumAmount + ' ' + window.lupoex.stellar.nativeAssetCode + '.'
                        };
                        this.loading--;
                        return;
                    }

                    operations.push(
                        StellarSdk.Operation.createAccount({
                            destination: this.destination,
                            startingBalance: this.amount.toString()
                        })
                    );
                }
                else {
                    this.alertConfig = {
                        type: 'error',
                        message: 'That destination account does not exist on the stellar network. Please ensure that you are sending this payment to an existing account.'
                    };
                    this.loading--;
                    return;
                }
            }
            else {
                operations.push(
                    StellarSdk.Operation.payment({
                        destination: this.destination,
                        amount: this.amount.toString(),
                        asset: this.isNative ?
                            StellarSdk.Asset.native() :
                            new StellarSdk.Asset(this.code, this.issuer)
                    })
                );
            }

            try {
                await this.transactionService.submit(operations, {
                    memo: this.memo ? new StellarSdk.Memo[this.memoMethodFromType(this.memo.type)](this.memo.value) : undefined
                });
                this.refresh();
            }
            catch (e) {
                this.tryAgain();
            }
        }
        catch (e) {
            this.alertConfig = {
                type: 'error',
                message: e.message || 'Something is wrong, can\'t submit the payment to the network'
            };
        }

        this.loading--;
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

    memoTypeTitle(memoType) {
        switch (memoType) {
            case 'id':
                return 'Id';
            case 'text':
                return 'Text';
            case 'hash':
                return 'Hash';
            case 'returnHash':
                return 'Return';
            default:
                throw new Error('Unrecognized Memo Type.');
        }
    }
}
