/**
 * Created by istrauss on 5/8/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import {BaseOfferService} from './base-offer-service';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(AppStore, BaseOfferService, AppActionCreators)
export class OfferService {

    constructor(appStore, baseOfferService, appActionCreators) {
        this.appStore = appStore;
        this.baseOfferService = baseOfferService;
        this.appActionCreators = appActionCreators;
    }

    async createOffer(passedInfo) {
        await this.baseOfferService.createOffer(passedInfo);

        await Promise.all([
            this.appStore.dispatch(this.appActionCreators.updateAccount()),
            this.appStore.dispatch(this.appActionCreators.updateOffers())
        ]);
    }

    async cancelOffer(offerId) {
        await this.baseOfferService.cancelOffer(offerId);

        await Promise.all([
            this.appStore.dispatch(this.appActionCreators.updateAccount()),
            this.appStore.dispatch(this.appActionCreators.updateOffers())
        ]);
    }

    allOffers(accountId, page) {
        return this.baseOfferService(accountId, page);
    }
}
