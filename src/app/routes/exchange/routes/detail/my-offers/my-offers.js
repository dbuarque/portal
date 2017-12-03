/**
 * Created by istrauss on 6/4/2017.
 */

import {inject, computedFrom} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {OfferService} from 'app-resources';
import {UpdateMyOffersActionCreator} from '../action-creators';

@inject(OfferService, UpdateMyOffersActionCreator)
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

    constructor(offerService, updateMyOffers) {
        this.offerService = offerService;
        this.updateMyOffers = updateMyOffers;
    }

    async cancel(offer) {
        await this.offerService.cancelOffer(offer);
        this.updateMyOffers.dispatch();
    }
}
