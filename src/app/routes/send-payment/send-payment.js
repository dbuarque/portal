/**
 * Created by istrauss on 5/19/2017.
 */

import './send-payment.scss';
import * as StellarSdk from 'stellar-sdk';
import {inject, computedFrom} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {ValidationRules, ValidationController, validateTrigger} from 'aurelia-validation';
import {connected} from 'aurelia-redux-connect';
import {asyncBindable} from 'aurelia-async-bindable-bluebird';
import {ModalService} from 'global-resources';
import {AccountResource, TransactionService} from 'app-resources';

@inject(Router, ValidationController, ModalService, AccountResource, TransactionService)
export class SendPayment {
    @connected('myAccount')
    account;

    @asyncBindable({
        pendWith: 0
    })
    @computedFrom('account')
    get balance() {
        if (!this.account) {
            return 0;
        }

        return this.type.toLowerCase() === 'native' ?
            this.account.balance :
            this.accountResource.trustline(this.account.accountId, {
                type: this.type,
                code: this.code,
                issuer: this.issuer
            })
                .then(trustline => trustline.balance)
                .catch(e => 0);
    }

    @computedFrom('type')
    get isNative() {
        return this.type.toLowerCase() === 'native';
    }

    @computedFrom('_memoType')
    get memoType() {
        return this._memoType;
    }
    set memoType(newType) {
        this.memoValue = undefined;
        this._memoType = newType;
    }

    memoTypes = [
        {
            title: 'Id',
            method: 'id'
        },
        {
            title: 'Text',
            method: 'text'
        },
        {
            title: 'Hash',
            method: 'hash'
        },
        {
            title: 'Return',
            method: 'returnHash'
        }
    ];
    loading = 0;
    step = 'input';

    constructor(router, validationController, modalService, accountResource, transactionService) {
        this.router = router;
        this.validationController = validationController;
        this.modalService = modalService;
        this.accountResource = accountResource;
        this.transactionService = transactionService;
        this.stellarportPublicKey = window.stellarport.publicKey;

        this.configureValidation();
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

    configureValidation() {
        const self = this;

        self.validationController.validateTrigger = validateTrigger.blur;

        ValidationRules
            .ensure('destination')
            .displayName('Destination Address')
            .required()
            .ensure('amount')
            .displayName('Amount')
            .required()
            .satisfies(value => parseFloat(value, 10) > 0 && parseFloat(value, 10) <= parseFloat(self.balance, 10))
            .withMessage(`Not enough \${$object.code}`)
            .ensure('memoValue')
            .displayName('Memo Value')
            .required()
            .when(vm => vm.memoType)
            .maxLength(64)
            .when(vm => vm.memoType && vm.memoType !== 'text')
            .maxLength(28)
            .when(vm => vm.memoType === 'text')
            .on(self);
    }

    async submitInput() {
        const validationResult = await this.validationController.validate();
        if (!validationResult.valid) {
            return;
        }

        if (this.requiredMemo) {
            this.memoType = this.requiredMemoType;
            this.memoValue = this.requiredMemo;
        }

        this.step = 'confirm';
    }

    tryAgain() {
        this.errorMessage = undefined;
        this.step = 'input';
    }

    refresh() {
        this.amount = undefined;
        this.memoType = undefined;
        this.validationController.reset();
        this.step = 'input';
        this.errorMessage = undefined;
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
                    const mimimumAmount = (window.stellarport.stellar.baseReserve * 2) + 0.00001;

                    if (parseInt(this.amount, 10) < mimimumAmount) {
                        this.errorMessage = 'That destination account does not exist. We cannot create the account with less than ' + mimimumAmount + ' ' + window.stellarport.stellar.nativeAssetCode + '.';
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
                    this.errorMessage = 'That destination account does not exist on the stellar network. Please ensure that you are sending this payment to an existing account.';
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
                    memo: this.memoValue ? new StellarSdk.Memo[this.memoType](this.memoValue) : undefined
                });
                this.refresh();
            }
            catch (e) {
                this.tryAgain();
            }
        }
        catch (e) {
            this.errorMessage = e.message || 'Something is wrong, can\'t submit the payment to the network';
        }

        this.loading--;
    }
}
