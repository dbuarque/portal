/**
 * Created by istrauss on 6/4/2017.
 */

import {inject, computedFrom} from 'aurelia-framework';
import {connected, Store} from 'au-redux';
import {OfferService} from 'app-resources';
import {DetailActionCreators} from '../detail-action-creators';

@inject(Store, OfferService, DetailActionCreators)
export class MyOffersCustomElement {

    @connected('exchange.assetPair')
    assetPair;

    @connected('exchange.detail.myOffers')
    myOffers;
    
    @computedFrom('myOffers')
    get anyOffers() {
        return this.myOffers &&
            (
                (this.myOffers.bids && this.myOffers.bids.length > 0) ||
                (this.myOffers.asks && this.myOffers.asks.length > 0)
            );
    }

    constructor(store, offerService, detailActionCreators) {
        this.store = store;
        this.offerService = offerService;
        this.detailActionCreators = detailActionCreators;
    }

    async cancel(offer) {
        await this.offerService.cancelOffer(offer);
        this.store.dispatch(
            this.detailActionCreators.updateMyOffers()
        );
    }
}
