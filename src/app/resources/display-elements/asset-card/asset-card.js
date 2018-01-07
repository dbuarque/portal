import {bindable, computedFrom, inject} from 'aurelia-framework';
import {asyncBindable} from 'aurelia-async-bindable-bluebird';
import {WithHttpProtocolValueConverter} from 'global-resources';
import {TomlCache} from 'app-resources';
import {AssetSelectionService} from '../../crud/stellar/asset-selection-service';

@inject(TomlCache, WithHttpProtocolValueConverter, AssetSelectionService)
export class AssetCardCustomElement {
    @bindable() reselect;
    @bindable() asset;

    loading = 0;

    @computedFrom('asset', 'toml')
    get imageSrc() {
        return this.asset.type.toLowerCase() === 'native' ?
            '/assets/stellar-rocket-144x144.png' :
            this.toml && this.toml.image ?
                this.toml.image :
                '/assets/font-awesome_4-7-0_question-circle-o_144_10_e0e0e0_none.png';
    }

    @computedFrom('asset', 'toml')
    get verified() {
        return this.asset.type.toLowerCase() === 'native' || this.toml;
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
        return this.asset.type.toLowerCase() === 'native' ?
            'Stellar' :
            this.asset.issuer ?
                this.asset.issuer.homeDomain :
                null;
    }

    @computedFrom('asset')
    get issuerAddress() {
        return this.asset.type.toLowerCase() === 'native' ?
            'Native' :
            this.asset.issuer ?
                this.asset.issuer.accountId :
                '';
    }

    @computedFrom('asset')
    get assetCode() {
        return this.asset.type.toLowerCase() === 'native' ?
            window.stellarport.stellar.nativeAssetCode :
            this.asset.code;
    }

    @computedFrom('asset', 'toml')
    get description() {
        return this.asset.type.toLowerCase() === 'native' ?
            window.stellarport.stellar.nativeAssetCode + ' is the native asset used to power the stellar network.' :
            this.toml && this.toml.desc ?
                this.toml.desc :
                this.asset.code + ' asset';
    }

    @asyncBindable()
    @computedFrom('asset')
    get toml() {
        if (!this.asset) {
            return null;
        }

        if (this.asset.type.toLowerCase() === 'native') {
            return null;
        }

        this.loading++;

        return this.tomlCache.assetToml(this.asset.issuer, this.asset.code)
            .then(toml => {
                this.loading--;

                return toml;
            });
    }

    constructor(tomlCache, withHttpProtocol, assetSelectionService) {
        this.tomlCache = tomlCache;
        this.withHttpProtocol = withHttpProtocol;
        this.assetSelectionService = assetSelectionService;
    }

    followHomeDomain(e) {
        window.open(
            this.homeDomain === 'Stellar' ?
                'https://stellar.org' :
                this.withHttpProtocol.toView(this.homeDomain),
            '_blank'
        );

        e.stopPropagation();
    }

    async openSidebar() {
        if (this.reselect) {
            try {
                const newAsset = await this.assetSelectionService.select(this.asset);
                this.reselect(newAsset);
            }
            catch (e) {}
        }
    }
}
