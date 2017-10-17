/**
 * Created by istrauss on 6/2/2017.
 */

import BigNumber from 'bignumber.js';
import {inject, Container, computedFrom} from 'aurelia-framework';
import {connected} from 'au-redux';
import {validStellarNumber} from 'app-resources';
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
        return !this.myAsk || !this.myAsk.price ?
            undefined :
            validStellarNumber(
                (new BigNumber(this.myAsk.price[0])).dividedBy(this.myAsk.price[1])
            );
    }
    set price(newPrice) {
        this.store.dispatch(this.detailActionCreators.updateMyAsk({
            price: (new BigNumber(newPrice)).toFraction()
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

    bind() {
        //Ensure that all @connected props are bound for superclass.
        CreateOffer.prototype.bind.call(this);
    }

    unbind() {
        //Ensure that all @connected props are unbound for superclass.
        CreateOffer.prototype.unbind.call(this);
    }
}
