/**
 * Created by istrauss on 5/8/2017.
 */

import {computedFrom} from 'aurelia-framework';
import BigNumber from 'bignumber.js';

export class OfferModal {

    loading = 0;

    @computedFrom('amount')
    get buyingAmount() {
        return (new BigNumber(this.amount)).times(this.price).toString(10);
    }

    @computedFrom('buyingAsset')
    get buyingIssuer() {
        if (this.buyingAsset.type.toLowerCase() === 'native') {
            return 'Native';
        }

        return this.buyingAsset.issuer.homeDomain ||
            this.buyingAsset.issuer.accountId ||
            this.buyingAsset.issuer;
    }

    @computedFrom('sellingAsset')
    get sellingIssuer() {
        if (this.sellingAsset.type.toLowerCase() === 'native') {
            return 'Native';
        }
        
        return this.sellingAsset.issuer.homeDomain ||
            this.sellingAsset.issuer.accountId ||
            this.sellingAsset.issuer;
    }

    activate(params) {
        this.modalVM = params.modalVM;
        this.type = params.passedInfo.type || 'bid';
        this.amount = params.passedInfo.amount;
        this.price = params.passedInfo.price;
        this.sellingAsset = params.passedInfo.sellingAsset;
        this.buyingAsset = params.passedInfo.buyingAsset;
    }

    async confirm() {
        this.modalVM.close();
    }

    cancel() {
        this.modalVM.dismiss();
    }
}
