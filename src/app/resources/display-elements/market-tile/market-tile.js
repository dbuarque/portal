
import {bindable} from 'aurelia-framework';

export class MarketTileCustomElement {

    @bindable asset;
    @bindable toml;

    get imageSrc() {
        return this.toml ? this.toml.image : '';
    }

    get verified() {
        return this.asset.type === 'native' || this.toml;
    }

    get homeDomain() {
        return this.asset.type !== 'native' ? this.asset.issuer.homeDomain : 'Native';
    }

    get issuerAddress() {
        return this.asset.type !== 'native' ? this.asset.issuer.accountId : '';
    }

    get assetCode() {
        return this.asset.type !== 'native' ? this.asset.code : window.lupoex.stellar.nativeAssetCode;
    }
}
