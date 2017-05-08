/**
 * Created by istrauss on 5/8/2017.
 */

import {inject} from 'aurelia-framework'
import {StellarServer, ValidationManager} from 'global-resources';
import {SecretStore} from '../../../auth/secret-store/secret-store';

@inject(StellarServer, ValidationManager, SecretStore)
export class PaymentModal {

    constructor(stellarServer, validationManager) {
        this.stellarServer = stellarServer;
        this.validationManager = validationManager;
    }

    activate(params) {
        this.modalVM = params.modalVM;
        Object.assign(this, params.passedInfo);
    }

    submit() {
        if (!this.validationManager.validate()) {
            return;
        }

        this.modalVM.close({
            destination: this.destination,
            amount: this.amount,
            code: this.code,
            issuer: this.issuer
        });
    }
}
