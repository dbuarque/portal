/**
 * Created by istrauss on 6/2/2017.
 */

import _debounce from 'lodash.debounce';
import _find from 'lodash.find';
import {bindable, inject, Container} from 'aurelia-framework';
import {OfferService} from 'app-resources';
import {CreateOffer} from './create-offer';
import {ExchangeActionCreators} from '../../../exchange-action-creators';

@inject(Container, OfferService, ExchangeActionCreators)
export class CreateBidCustomElement extends CreateOffer {
    
    constructor(container, offerService, exchangeActionCreators) {
        super(container);

        this.offerService = offerService;
        this.exchangeActionCreators = exchangeActionCreators;

        this.priceChanged = _debounce(() => {
            this.price = this.displayPrice ? 1 / parseFloat(this.displayPrice, 10) : this.displayPrice;
            this._priceChanged();
        }, 250);

        this.buyingAmountChanged = _debounce(() => {
            const price = this.price;

            this._buyingAmountChanged();

            if (price !== this.price) {
                this.displayPrice = this.price ? 1 / parseFloat(this.price, 10) : this.price;
            }
        }, 250);

        this.sellingAmountChanged = _debounce(() => {
            const price = this.price;

            this._sellingAmountChanged();

            if (price !== this.price) {
                this.displayPrice = this.price ? 1 / parseFloat(this.price, 10) : this.price;
            }
        }, 250);
    }

    get sellingAsset() {
        return this.assetPair.buying;
    }

    get buyingAsset() {
        return this.assetPair.selling;
    }

    get type() {
        return 'bid';
    }

    async submit() {
        if (!this.validate()) {
            return
        }

        try {
            await this.offerService.createOffer({
                type: 'Bid',
                buyingCode: this.assetPair.selling.code,
                buyingIssuer: this.assetPair.selling.code === window.lupoex.stellar.nativeAssetCode ? undefined : this.assetPair.selling.issuer,
                sellingCode: this.assetPair.buying.code,
                sellingIssuer: this.assetPair.buying.code === window.lupoex.stellar.nativeAssetCode ? undefined : this.assetPair.buying.issuer,
                sellingAmount: this.sellingAmount,
                price: parseFloat(this.buyingAmount, 10) / parseFloat(this.sellingAmount, 10)
            });

            this.appStore.dispatch(this.exchangeActionCreators.refreshOrderbook());
        }
        catch(e) {
            const i = e;
        }
    }
}
