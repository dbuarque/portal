
import {bindable, computedFrom, inject} from 'aurelia-framework';
import {shortenAddress, TomlCache} from "app-resources";

@inject(TomlCache)
export class AssetCardCustomElement {

    @bindable asset;

    loading = 0;

    @computedFrom('toml')
    get imageSrc() {
        return this.asset.type === 'native' ?
            '/assets/stellar-rocket-144x144.png' :
            this.toml && this.toml.image ?
                this.toml.image :
                '/assets/font-awesome_4-7-0_question-circle-o_144_10_e0e0e0_none.png';
    }

    @computedFrom('toml')
    get verified() {
        return this.asset.type === 'native' || this.toml;
    }

    @computedFrom('toml')
    get verifiedMessage() {
        return this.verified ?
            'This asset has been verified by ' + this.homeDomain :
            this.homeDomain ?
                'This asset has NOT been verified by ' + this.homeDomain :
                'This asset could not be verified because there is no web domain associated with it';
    }

    @computedFrom('asset')
    get homeDomain() {
        return this.asset.type === 'native' ?
            'Stellar' :
            this.asset.issuer ?
                this.asset.issuer.homeDomain :
                null;
    }

    @computedFrom('asset')
    get issuerAddress() {
        return this.asset.type === 'native' ?
            'Native' :
            this.asset.issuer ?
                shortenAddress(this.asset.issuer.accountId) :
                '';
    }

    @computedFrom('asset')
    get assetCode() {
        return this.asset.type === 'native' ?
            window.lupoex.stellar.nativeAssetCode :
                this.asset.code;
    }

    @computedFrom('toml')
    get description() {
        return this.asset.type === 'native' ?
            window.lupoex.stellar.nativeAssetCode + ' is the native asset used to power the stellar network.' :
            this.toml && this.toml.description ?
                this.toml.description :
                this.asset.code + ' asset';
    }

    constructor(tomlCache) {
        this.tomlCache = tomlCache;
    }

    async assetChanged() {
        if (this.asset.type === 'native') {
            return;
        }

        this.loading++;

        this.toml = await this.tomlCache.assetToml(this.asset.issuer, this.asset.code);

        this.loading--;
    }
}
