
import {bindable} from 'aurelia-framework';
import {shortenAddress} from "app-resources";

export class AssetCardCustomElement {

    @bindable asset;

    get imageSrc() {
        return this.asset.type === 'native' ?
            '/assets/stellar-rocket-144x144.png' :
            this.asset.toml && this.asset.toml.image ?
                this.asset.toml.image :
                '/assets/font-awesome_4-7-0_question-circle-o_144_10_e0e0e0_none.png';
    }

    get verified() {
        return this.asset.type === 'native' || this.asset.toml;
    }

    get homeDomain() {
        return this.asset.type === 'native' ?
            'Stellar' :
            this.asset.issuer ?
                this.asset.issuer.homeDomain :
                null;
    }

    get issuerAddress() {
        return this.asset.type === 'native' ?
            'Native' :
            this.asset.issuer ?
                shortenAddress(this.asset.issuer.accountId) :
                '';
    }

    get assetCode() {
        return this.asset.type === 'native' ?
            window.lupoex.stellar.nativeAssetCode :
                this.asset.code;
    }
}
