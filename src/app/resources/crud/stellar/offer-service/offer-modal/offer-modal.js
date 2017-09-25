/**
 * Created by istrauss on 5/8/2017.
 */

import BigNumber from 'bignumber.js';

export class OfferModal {

    loading = 0;

    get buyingAmount() {
        return (new BigNumber(this.amount)).dividedBy(this.price).toString(10);
    }

    activate(params) {
        this.nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
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
