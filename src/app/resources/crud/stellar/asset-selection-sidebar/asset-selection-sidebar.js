
import _debounce from 'lodash/debounce';
import {inject} from 'aurelia-framework';
import {AssetResource} from '../../resources/asset-resource';
import {AssetSelectionService} from '../asset-selection-service';

@inject(AssetResource, AssetSelectionService)
export class AssetSelectionSidebarCustomElement {
    limit = 10;
    offset = 0;

    constructor(assetResource, assetSelectionService) {
        this.assetResource = assetResource;
        this.assetSelectionService = assetSelectionService;

        this.refresh = _debounce(this._refresh.bind(this), 250);
    }

    attached() {
        this.assetSelectionService._registerCustomElement(this);
    }

    open(asset) {
        const self = this;

        self.startingAsset = self.asset = asset;

        self.sidenavController.show();

        if (!self.assets) {
            self.refresh();
        }

        return new Promise((resolve, reject) => {
            self.resolve = resolve;
            self.reject = reject;
        });
    }

    finish() {
        this.resolve(this.asset);

        delete this.resolve;
        delete this.reject;

        this.sidenavController.hide();
    }

    onHide() {
        if (this.reject) {
            this.reject();
        }
    }

    select(asset) {
        this.asset = asset;
    }

    async loadMore() {
        this.loading = true;
        this.offset = this.offset + this.limit;

        const moreAssets = await this.assetResource.query({
            code: this.code,
            issuer: this.issuer,
            offset: this.offset,
            limit: this.limit
        });

        this.assets = this.assets.concat(
            moreAssets.map(a => this.processRawAsset(a))
        );

        if (moreAssets.length < this.limit) {
            this.noMore = true;
        }

        this.loading = false;
    }

    processRawAsset(rawAsset) {
        return {
            type: rawAsset.assetType,
            code: rawAsset.assetCode,
            issuerId: rawAsset.assetIssuer,
            issuer: {
                accountId: rawAsset.assetIssuer,
                homeDomain: rawAsset.homeDomain
            }
        };
    }

    async _refresh() {
        this.noMore = false;
        this.refreshing = true;
        this.offset = 0;

        const rawAssets = await this.assetResource.query({
            code: this.code,
            issuer: this.issuer,
            limit: this.limit
        });

        this.assets = rawAssets.map(a => this.processRawAsset(a));

        if (this.assets.length < this.limit) {
            this.noMore = true;
        }

        this.refreshing = false;
    }
}
