/**
 * Created by istrauss on 5/8/2017.
 */

import {inject, NewInstance} from 'aurelia-framework';
import {Store} from 'aurelia-redux-connect';
import {ValidationRules, ValidationController, validateTrigger} from 'aurelia-validation';
import {AccountResource} from 'app-resources';

@inject(Store, NewInstance.of(ValidationController), AccountResource)
export class OfferModal {
    loading = 0;

    constructor(store, validationController, accountResource) {
        this.store = store;
        this.validationController = validationController;
        this.accountResource = accountResource;

        this.configureValidation();
    }

    async activate(params) {
        this.modalVM = params.modalVM;
        this.type = params.passedInfo.type;
        this.code = params.passedInfo.code;
        this.issuer = params.passedInfo.issuer;

        this.getTrustline();
    }

    configureValidation() {
        this.validationController.validateTrigger = validateTrigger.blur;

        ValidationRules
            .ensure('newLimit')
            .displayName('New Limit')
            .required()
            .on(this);
    }

    async getTrustline() {
        this.loading++;
        const trustline = await this.accountResource.trustline(this.store.getState().myAccount.accountId, {
            type: this.type,
            code: this.code,
            issuer: this.issuer
        });
        this.newLimit = this.limit = trustline ? trustline.trustLimit : 0;
        this.loading--;
    }

    async modifyLimit() {
        const validationResult = await this.validationController.validate();
        if (!validationResult.valid) {
            return;
        }

        this.modalVM.dismissible = false;
        this.loading++;

        this.modalVM.close(this.newLimit);
    }

    cancel() {
        this.modalVM.dismiss();
    }
}
