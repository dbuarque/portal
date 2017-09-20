/**
 * Created by istrauss on 5/19/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {HttpClient} from 'aurelia-fetch-client';
import {Store} from 'au-redux';
import {ModalService, ValidationManager, StellarServer} from 'global-resources';
import {TransactionService} from 'app-resources';
import {AppActionCreators} from '../../app-action-creators';

@inject(Router, HttpClient, ModalService, Store, ValidationManager, StellarServer, TransactionService, AppActionCreators)
export class SendPayment {

    loading = 0;
    step = 'input';
    confirmInfoAlertConfig = {
        type: 'info',
        message: 'Once made, payments are <strong>irreversible</strong>. Please be sure to verify every detail of your payment before confirming. Confirm the details of your payment below. ',
        dismissible: false
    };

    constructor(router, httpClient, modalService, store, validationManager, stellarServer, transactionService, appActionCreators) {
        this.router = router;
        this.httpClient = httpClient;
        this.modalService = modalService;
        this.store = store;
        this.validationManager = validationManager;
        this.transactionService = transactionService;
        this.stellarServer = stellarServer;
        this.appActionCreators = appActionCreators;

        this.lupoexPublicKey = window.lupoex.publicKey;
    }

    activate(params) {
        this.nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        this.code = params.code;
        this.issuer = params.issuer;
        this.destination = params.destination;
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
            }
        }

        this.step = 'confirm';
    }

    finish() {
        this.router.navigate('/account/asset-balances');
    }

    tryAgain() {
        this.alertConfig = undefined;
        this.step = 'input';
    }

    refresh() {
        this.amount = undefined;
        this.memos = [];
        this.validationManager.clear();
        this.step = 'input';
        this.alertConfig = undefined;
    }

    async generateSuccessMessage(response) {
        const transactionResponse = await this.httpClient.fetch(response._links.transaction.href);
        const transaction = await transactionResponse.json();
        const effectsResponse = await this.stellarServer.effects().forTransaction(transaction.id).call();

        return effectsResponse.records.reduce((html, e) => {
                let msg = '';
                switch(e.type) {
                    case 'account_credited':
                        msg = 'Sent ' + e.amount + ' ' + (e.asset_type === 'native' ? this.nativeAssetCode : e.asset_code) + ' to account <span style="word-break: break-all;">' + e.account + '</span>.';
                        break;
                    case 'account_created':
                        msg = 'Account <span style="word-break: break-all;">' + e.account + '</span> created with 20 ' + this.nativeAssetCode + '.';
                        break;
                }

                return html + '<li>' + msg + '</li>';
            }, '<ul>') + '</ul>';
    }

    async submitConfirmation() {
        this.loading++;

        try {
            //Let's check if the destinationAccount exists.
            let destinationAccount;

            try {
                destinationAccount = await this.stellarServer.loadAccount(this.destination);
            }

            catch(e) {
                //404 means that account does not exist
                if (e.data.status !== 404) {
                    this.alertConfig = {
                        type: 'error',
                        message: 'Something is wrong. Your payment could not be sent.'
                    };
                    this.loading--;
                    return;
                }
            }

            let operations = [];

            //Destination account doest exist? Let's try to create it (if the user is sending native asset).
            if (!destinationAccount) {
                if (this.code === this.nativeAssetCode) {
                    if (parseInt(this.amount, 10) < 20) {
                        this.alertConfig = {
                            type: 'error',
                            message: 'That destination account does not exist. We cannot create the account with less than ' + window.lupoex.stellar.minimumNativeBalance.toString() + ' ' + window.lupoex.stellar.nativeAssetCode + '.'
                        };
                        this.loading--;
                        return;
                    }

                    operations.push(
                        this.stellarServer.sdk.Operation.createAccount({
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
                    this.stellarServer.sdk.Operation.payment({
                        destination: this.destination,
                        amount: this.amount.toString(),
                        asset: this.code === this.nativeAssetCode ?
                            this.stellarServer.sdk.Asset.native() :
                            new this.stellarServer.sdk.Asset(this.code, this.issuer)
                    })
                );
            }

            try {
                await this.transactionService.submit(operations, {
                    memo: this.memo ? this.stellarServer.sdk.Memo[this.memoMethodFromType(this.memo.type)](this.memo.value) : undefined,
                    onSuccess: this.generateSuccessMessage.bind(this)
                });
                this.refresh();
            }
            catch(e) {
                this.tryAgain();
            }
        }
        catch(e) {
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
