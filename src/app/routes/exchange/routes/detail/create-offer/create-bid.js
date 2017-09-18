/**
 * Created by istrauss on 6/2/2017.
 */

import BigNumber from 'bignumber.js';
import {inject, Container, computedFrom} from 'aurelia-framework';
import {connected} from 'au-redux';
import {CreateOffer} from './create-offer';
import {DetailActionCreators} from '../detail-action-creators';

@inject(Container, DetailActionCreators)
export class CreateBidCustomElement extends CreateOffer {

    @connected('exchange.detail.myBid')
    myBid;

    get type() {
        return 'bid';
    }

    @computedFrom('myBid')
    get price() {
        return this.myBid ? (new BigNumber(1)).dividedBy(this.myBid.price).toString(10) : undefined;
    }
    set price(newPrice) {
        this.store.dispatch(this.detailActionCreators.updateMyBid({
            price: newPrice ? (new BigNumber(1)).dividedBy(newPrice).toString(10) : newPrice
        }));
    }

    @computedFrom('myBid')
    get sellingAmount() {
        return this.myBid ? this.myBid.sellingAmount : undefined;
    };
    set sellingAmount(newAmount) {
        this.store.dispatch(this.detailActionCreators.updateMyBid({
            sellingAmount: newAmount
        }));
    }

    @computedFrom('myBid')
    get buyingAmount() {
        return this.myBid ? this.myBid.buyingAmount : undefined;
    };
    set buyingAmount(newAmount) {
        this.store.dispatch(this.detailActionCreators.updateMyBid({
            buyingAmount: newAmount
        }));
    }

    get sellingAsset() {
        return this.assetPair ? this.assetPair.buying : {};
    }

    get buyingAsset() {
        return this.assetPair ? this.assetPair.selling : {};
    }

    get mySellingAsset() {
        return this.myAssetPair ? this.myAssetPair.buying : {};
    }

    get myBuyingAsset() {
        return this.myAssetPair ? this.myAssetPair.selling : {};
    }
    
    constructor(container, detailActionCreators) {
        super(container);

        this.detailActionCreators = detailActionCreators;
    }
}
