/**
 * Created by istrauss on 6/16/2017.
 */

export class AssetPairValueConverter {
    toView(market) {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        const boughtAssetCode = market.bought_asset_type === 'native' ? nativeAssetCode : market.bought_asset_code;
        const soldAssetCode = market.sold_asset_type === 'native' ? nativeAssetCode : market.sold_asset_code;

        return boughtAssetCode + '/' + soldAssetCode;
    }
}

export class PercentGainValueConverter {
    toView(percentGain) {
        return '<span class="success-text">+' + percentGain.toFixed(2) + '</span>';
    }
}