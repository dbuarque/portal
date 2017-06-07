/**
 * Created by istrauss on 5/8/2017.
 */

import {inject} from 'aurelia-framework';
import {BaseOfferService} from './base-offer-service';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(BaseOfferService, AppActionCreators)
export class OfferService {

    constructor(baseOfferService, appActionCreators) {
        this.baseOfferService = baseOfferService;
        this.appActionCreators = appActionCreators;
    }

    createOffer(passedInfo) {
        return this.baseOfferService.createOffer(passedInfo);
    }

    async cancelOffer(offerId) {
        //We need to update the account prior to creating the transaction in order to ensure that the account.sequence is updated.
        await this.appStore.dispatch(this.appActionCreators.updateAccount());

        await this.baseOfferService.cancelOffer(offerId);
    }

    allOffers(accountId, page) {
        return this.baseOfferService(accountId, page);
    }
}
