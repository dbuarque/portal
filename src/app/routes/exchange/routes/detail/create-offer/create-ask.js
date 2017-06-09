/**
 * Created by istrauss on 6/2/2017.
 */

import _find from 'lodash.find';
import {bindable, inject, Container} from 'aurelia-framework';
import {OfferService} from 'app-resources';
import {CreateOffer} from './create-offer';
import {ExchangeActionCreators} from '../../../exchange-action-creators';

@inject(Container, OfferService, ExchangeActionCreators)
export class CreateAskCustomElement extends CreateOffer {
    
    constructor(container, offerService, exchangeActionCreators) {
        super(container);

        this.offerService = offerService;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    get sellingAsset() {
        return this.assetPair.selling;
    }

    get buyingAsset() {
        return this.assetPair.buying;
    }

    async submit() {
        if (!this.validate()) {
            return;
        }

        try {
            await this.offerService.createOffer({
                type: 'Ask',
                buyingCode: this.assetPair.buying.code,
                buyingIssuer: this.assetPair.buying.code === window.lupoex.stellar.nativeAssetCode ? undefined : this.assetPair.buying.issuer,
                sellingCode: this.assetPair.selling.code,
                sellingIssuer: this.assetPair.selling.code === window.lupoex.stellar.nativeAssetCode ? undefined : this.assetPair.selling.issuer,
                sellingAmount: this.sellingAmount,
                price: parseFloat(this.buyingAmount, 10) / parseFloat(this.sellingAmount, 10)
            });

            this.appStore.dispatch(this.exchangeActionCreators.refreshOrderbook());
        }
        catch(e) {}
    }
}
