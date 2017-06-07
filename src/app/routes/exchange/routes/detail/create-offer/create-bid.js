/**
 * Created by istrauss on 6/2/2017.
 */

import _debounce from 'lodash.debounce';
import _find from 'lodash.find';
import {bindable, inject, Container} from 'aurelia-framework';
import {OfferService} from 'app-resources';
import {CreateOffer} from './create-offer';
import {AppActionCreators} from '../../../../../app-action-creators';

@inject(Container, OfferService, AppActionCreators)
export class CreateBidCustomElement extends CreateOffer {
    
    constructor(container, offerService, appActionCreators) {
        super(container);

        this.offerService = offerService;
        this.appActionCreators = appActionCreators;

        this.priceChanged = _debounce(() => {
            this.price = this.displayPrice ? 1 / parseFloat(this.displayPrice, 10) : this.displayPrice;
            this.price = this.price ? this.price.toFixed(7) : this.price;
            this._priceChanged();
        }, 250);

        this.buyingAmountChanged = _debounce(() => {
            this._buyingAmountChanged();

            this.displayPrice = this.price ? 1 / parseFloat(this.price, 10) : this.price;
            this.displayPrice = this.displayPrice ? this.displayPrice.toFixed(7) : this.displayPrice;
        }, 250);

        this.sellingAmountChanged = _debounce(() => {
            this._sellingAmountChanged();

            this.displayPrice = this.price ? 1 / parseFloat(this.price, 10) : this.price;
            this.displayPrice = this.displayPrice ? this.displayPrice.toFixed(7) : this.displayPrice;
        }, 250);
    }

    filterOffers(allOffers) {
        return allOffers.filter(o => {
            return this.compareAssets(o.buying, this.assetPair.selling) || this.compareAssets(o.selling, this.assetPair.selling);
        });
    }

    get needsTrustline() {
        return this.assetPair.selling.code !== window.lupoex.stellar.nativeAssetCode;
    }

    get buyingAssetBalance() {
        const asset = _find(this.account.balances, a => {
            return this.compareAssets(a, this.assetPair.selling);
        });

        return asset ? asset.balance : 0;
    }

    get sellingAssetBalance() {
        const asset = _find(this.account.balances, a => {
            return this.compareAssets(a, this.assetPair.buying);
        });

        return asset ? asset.balance : 0;
    }

    get sellingAsset() {
        return this.assetPair.buying;
    }

    get buyingAsset() {
        return this.assetPair.selling;
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
                trustline: this.trustline,
                price: parseFloat(this.buyingAmount, 10) / parseFloat(this.sellingAmount, 10)
            });

            this.appStore.dispatch(this.appActionCreators.updateOffers());
        }
        catch(e) {}
    }
}
