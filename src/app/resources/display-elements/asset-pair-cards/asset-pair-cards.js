
import {bindable} from 'aurelia-framework';

export class AssetPairCardsCustomElement {
    @bindable reselect;
    @bindable switchAssets;
    @bindable assetPair;

    bind() {
        this.reselectBuying = this.reselect ? this._reselectBuying.bind(this) : undefined;
        this.reselectSelling = this.reselect ? this._reselectSelling.bind(this) : undefined;
    }

    _reselectBuying(asset) {
        this.reselect(asset, 'buying');
    }

    _reselectSelling(asset) {
        this.reselect(asset, 'selling');
    }
}
