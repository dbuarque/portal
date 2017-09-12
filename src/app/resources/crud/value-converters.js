/**
 * Created by istrauss on 9/10/2017.
 */

export class AssetPairToUrlValueConverter {
    toView(assetPair) {
        return '/' + assetPair.selling.code +
            '/' + (assetPair.selling.code === window.lupoex.stellar.nativeAssetCode ? 'native' : assetPair.selling.issuer) +
            '/' + assetPair.buying.code +
            '/' + (assetPair.buying.code === window.lupoex.stellar.nativeAssetCode ? 'native' : assetPair.buying.issuer);
    }
}
