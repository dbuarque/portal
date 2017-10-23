
import {bindable} from 'aurelia-framework';

export class MarketTileCustomElement {

    @bindable asset;
    @bindable toml;

    get imageSrc() {
        return this.toml.image;
    }

    get verified() {
        return this.toml;
    }

    get homeDomain() {
        return this.asset.issuer.home_domain;
    }

    get issuerAddress() {
        return this.asset.issuer.address;
    }
}
