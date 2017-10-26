/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';

export class AssetUrlValueConverter {
    toView(asset) {
        const issuerAddress = asset.type.toLowerCase() === 'native' ?
            'Stellar' :
            (asset.issuer.accountId || asset.issuer);

        return '/' + asset.code + '/' + issuerAddress;
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
