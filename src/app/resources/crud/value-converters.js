/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';

export class AssetUrlValueConverter {
    toView(asset) {
        return '/' + asset.code +
            '/' + (asset.type.toLowerCase() === 'native' ? 'Stellar' : asset.issuer);
    }
}

@inject(AssetUrlValueConverter)
export class AssetPairToUrlValueConverter {

    constructor(assetUrl) {
        this.assetUrl = assetUrl;
    }

    toView(assetPair) {
        return this.assetUrl.toView(assetPair.selling) + this.assetUrl.toView(assetPair.buying);
    }
}
