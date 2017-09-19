/**
 * Created by istrauss on 6/2/2017.
 */

import {inject, Container, computedFrom} from 'aurelia-framework';
import {connected} from 'au-redux';
import {CreateOffer} from './create-offer';
import {DetailActionCreators} from '../detail-action-creators';

@inject(Container, DetailActionCreators)
export class CreateAskCustomElement extends CreateOffer {

    @connected('exchange.detail.myAsk')
    myAsk;

    get type() {
        return 'ask';
    }

    @computedFrom('myAsk')
    get price() {
        return this.myAsk ? this.myAsk.price : undefined;
    }
    set price(newPrice) {
        this.store.dispatch(this.detailActionCreators.updateMyAsk({
            price: newPrice
        }));
    }

    @computedFrom('myAsk')
    get sellingAmount() {
        return this.myAsk ? this.myAsk.sellingAmount : undefined;
    };
    set sellingAmount(newAmount) {
        this.store.dispatch(this.detailActionCreators.updateMyAsk({
            sellingAmount: newAmount
        }));
    }

    @computedFrom('myAsk')
    get buyingAmount() {
        return this.myAsk ? this.myAsk.buyingAmount : undefined;
    };
    set buyingAmount(newAmount) {
        this.store.dispatch(this.detailActionCreators.updateMyAsk({
            buyingAmount: newAmount
        }));
    }

    @computedFrom('assetPair')
    get sellingAsset() {
        return this.assetPair ? this.assetPair.selling : {};
    }

    @computedFrom('assetPair')
    get buyingAsset() {
        return this.assetPair ? this.assetPair.buying : {};
    }

    @computedFrom('myAssetPair')
    get mySellingAsset() {
        return this.myAssetPair ? this.myAssetPair.selling : {};
    }

    @computedFrom('myAssetPair')
    get myBuyingAsset() {
        return this.myAssetPair ? this.myAssetPair.buying : {};
    }

    constructor(container, detailActionCreators) {
        super(container);

        this.detailActionCreators = detailActionCreators;
    }
}
