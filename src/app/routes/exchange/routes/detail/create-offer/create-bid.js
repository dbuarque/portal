/**
 * Created by istrauss on 6/2/2017.
 */

import BigNumber from 'bignumber.js';
import {inject, Container, computedFrom} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {validStellarNumber} from 'app-resources';
import {CreateOffer} from './create-offer';
import {UpdateMyBidActionCreator} from '../action-creators';

@inject(Container, UpdateMyBidActionCreator)
export class CreateBidCustomElement extends CreateOffer {

    @connected('exchange.detail.myBid')
    myBid;

    get type() {
        return 'bid';
    }

    @computedFrom('myBid')
    get price() {
        return !this.myBid || !this.myBid.price ?
            undefined :
            validStellarNumber(
                (new BigNumber(this.myBid.price[1])).dividedBy(this.myBid.price[0])
            );
    }
    set price(newPrice) {
        this.updateMyBid.dispatch({
            price: newPrice ?
                (new BigNumber(newPrice)).toFraction().reverse() :
                newPrice
        });
    }

    @computedFrom('myBid')
    get sellingAmount() {
        return this.myBid ? this.myBid.sellingAmount : undefined;
    };
    set sellingAmount(newAmount) {
        this.updateMyBid.dispatch({
            sellingAmount: newAmount
        });
    }

    @computedFrom('myBid')
    get buyingAmount() {
        return this.myBid ? this.myBid.buyingAmount : undefined;
    };
    set buyingAmount(newAmount) {
        this.updateMyBid.dispatch({
            buyingAmount: newAmount
        });
    }

    @computedFrom('assetPair')
    get sellingAsset() {
        return this.assetPair ? this.assetPair.buying : {};
    }

    @computedFrom('assetPair')
    get buyingAsset() {
        return this.assetPair ? this.assetPair.selling : {};
    }

    @computedFrom('myAssetPair')
    get mySellingAsset() {
        return this.myAssetPair ? this.myAssetPair.buying : {};
    }

    @computedFrom('myAssetPair')
    get myBuyingAsset() {
        return this.myAssetPair ? this.myAssetPair.selling : {};
    }

    constructor(container, updateMyBid) {
        super(container);

        this.updateMyBid = updateMyBid;
    }
}
