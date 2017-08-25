/**
 * Created by istrauss on 5/8/2017.
 */

import {inject} from 'aurelia-framework';
 import {Store} from 'au-redux';
import {BaseOfferService} from './base-offer-service';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(Store, BaseOfferService, AppActionCreators)
export class OfferService {

    constructor(store, baseOfferService, appActionCreators) {
        this.store = store;
        this.baseOfferService = baseOfferService;
        this.appActionCreators = appActionCreators;
    }

    async createOffer(passedInfo) {
        await this.baseOfferService.createOffer(passedInfo);

        await Promise.all([
            this.store.dispatch(this.appActionCreators.updateAccount()),
            this.store.dispatch(this.appActionCreators.updateOffers())
        ]);
    }

    async cancelOffer(offer) {
        await this.baseOfferService.cancelOffer(offer);

        await Promise.all([
            this.store.dispatch(this.appActionCreators.updateAccount()),
            this.store.dispatch(this.appActionCreators.updateOffers())
        ]);
    }

    allOffers(accountId, page) {
        return this.baseOfferService(accountId, page);
    }
}
