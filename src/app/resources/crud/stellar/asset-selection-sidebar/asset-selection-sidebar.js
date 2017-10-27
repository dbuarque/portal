
import _debounce from 'lodash/debounce';
import {inject} from 'aurelia-framework';
import {AssetResource} from '../../resources/asset-resource';
import {AssetSelectionService} from '../asset-selection-service';

@inject(AssetResource, AssetSelectionService)
export class AssetSelectionSidebarCustomElement {

    limit = 25;

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

        $("#sidenav-overlay").unbind('click');

        return new Promise((resolve, reject) => {
            self.resolve = resolve;
            self.reject = reject;
        });
    }
    
    finish() {
        this.sidenavController.hide();
        this.resolve(this.asset);
    }

    cancel() {
        this.sidenavController.hide();
        this.reject();
    }

    select(asset) {
        this.asset = asset;
    }

    async _refresh() {
        this.noMore = false;
        this.refreshing = true;
        this.offset = 0;

        this.assets = await this.assetResource.get({
            code: this.code,
            issuer: this.issuer,
            limit: this.limit
        });

        if (this.assets.length < this.limit) {
            this.noMore = true;
        }

        this.refreshing = false;
    }

    async loadMore() {
        this.loading = true;
        this.offset = this.offset + this.limit;

        const moreAssets = await this.assetResource.get({
            code: this.code,
            issuer: this.issuer,
            offset: this.offset,
            limit: this.limit
        });

        this.assets = this.assets.concat(moreAssets);

        if (moreAssets.length < this.limit) {
            this.noMore = true;
        }

        this.loading = false;
    }
}
