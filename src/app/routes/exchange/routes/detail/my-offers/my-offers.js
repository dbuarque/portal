/**
 * Created by istrauss on 6/4/2017.
 */

import {inject} from 'aurelia-framework';
import {connected} from 'au-redux';
import {OfferService} from 'app-resources';
import {DetailActionCreators} from '../detail-action-creators';

@inject(OfferService, DetailActionCreators)
export class MyOffersCustomElement {

    @connected('exchange.detail.myOffers')
    myOffers;

    constructor(offerService, detailActionCreators) {
        this.offerService = offerService;
        this.detailActionCreators = detailActionCreators;
    }

    async cancel(bid) {
        await this.offerService.cancelOffer(bid);
        this.detailActionCreators.updateMyOffers();
        this.detailActionCreators.updateMyAssetPair();
    }
}
