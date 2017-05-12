/**
 * Created by istrauss on 5/8/2017.
 */

import {inject} from 'aurelia-framework'
import {StellarServer, ValidationManager, AppStore} from 'global-resources';
import {SecretStore} from '../../../auth/secret-store/secret-store';

@inject(StellarServer, ValidationManager, AppStore, SecretStore)
export class PaymentModal {

    step = 'input';

    constructor(stellarServer, validationManager, appStore, secretStore) {
        this.stellarServer = stellarServer;
        this.validationManager = validationManager;
        this.appStore = appStore;
        this.secretStore = secretStore;
    }

    activate(params) {
        this.nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        this.modalVM = params.modalVM;
        this.code = params.passedInfo.code;
        this.issuer = params.passedInfo.issuer;
        this.lockCode = params.passedInfo.lockCode;
        this.lockIssuer = params.passedInfo.lockIssuer;
    }

    submitInput() {
        if (!this.validationManager.validate()) {
            return;
        }

        this.alertConfig = {
            type: 'warning',
            message: 'Confirm the details of your payment below. <strong>Warning</strong>: Once made, payments are <strong>irreversible</strong>. Please be sure to verify every detail of your payment before confirming.'
        };

        this.step = 'confirm';
    }

    async submitConfirmation() {
        const transaction = new this.stellarServer.sdk.TransactionBuilder(this.appStore.account.id)
            .addOperation(Operation.payment({
                destination: this.destination,
                amount: this.amount,
                asset: this.code === this.nativeAssetCode ? this.stellarServer.sdk.Asset.native() : new this.stellarServer.sdk.Asset(this.code, this.issuer)
            }))
            .build();

        try {
            await this.secretStore.sign(transaction);

            await this.stellarServer.submitTransaction(transaction);

            this.modalVM.close(transaction);
        }
        catch(e) {
            this.modalVM.dismiss(e);
        }

    }
}
