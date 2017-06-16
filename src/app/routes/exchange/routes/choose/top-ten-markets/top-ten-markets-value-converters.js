/**
 * Created by istrauss on 6/16/2017.
 */

export class AssetPairValueConverter {
    toView(market) {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        const boughtAssetCode = market.bought_asset_type === 'native' ? nativeAssetCode : market.bought_asset_code;
        const soldAssetCode = market.sold_asset_type === 'native' ? nativeAssetCode : market.sold_asset_code;

        return soldAssetCode + '/' + boughtAssetCode;
    }
}

export class PercentGainValueConverter {
    toView(percentGain) {
        return '<span class="' + (percentGain < 0 ? 'error' : 'success') + '-text">' + percentGain.toFixed(2) + '</span>';
    }
}