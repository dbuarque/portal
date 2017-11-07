
export class PercentGainValueConverter {
    toView(percentGain) {
        return '<span class="success-text">+' + percentGain.toFixed(2) + '</span>';
    }
}

export class MarketToAssetPairValueConverter {
    toView(market) {
        return {
            buying: marketAsset(market, 'bought'),
            selling: marketAsset(market, 'sold')
        };
    }
}

function marketAsset(market, prefix) {
    return {
        type: market[prefix + 'AssetType'],
        code: market[prefix + 'AssetCode'],
        issuer: market[prefix + 'AssetIssuer']
    };
}
