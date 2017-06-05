/**
 * Created by istrauss on 6/2/2017.
 */

import _find from 'lodash.find';
import {bindable, inject, Container} from 'aurelia-framework';
import {OfferService} from 'app-resources';
import {CreateOffer} from './create-offer';

@inject(Container, OfferService)
export class CreateBidCustomElement extends CreateOffer {
    
    constructor(container, offerService) {
        super(container);

        this.offerService = offerService;
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
        }
        catch(e) {}
    }
}
