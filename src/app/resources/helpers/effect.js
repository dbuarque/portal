import {shortenAddress} from './misc';

export function userFriendlyEffectMessage(e, withSpan) {
    switch (e.type) {
        case 'ACCOUNT_CREATED':
            return 'Account created with initial balance of ' + e.details.starting_balance + ' ' + window.lupoex.stellar.nativeAssetCode;
        case 'ACCOUNT_REMOVED':
            return 'Account removed';
        case 'ACCOUNT_CREDITED':
            switch (e.operation.type) {
                case 'PAYMENT':
                case 'PATH_PAYMENT':
                    return 'Received payment from ' + shortenAddressSpan(e.operation.details.from, withSpan) + ' for ' +
                        assetDetailsToText(e.operation.details.amount, e.operation.details.asset_type, e.operation.details.asset_code);
                case 'ACCOUNT_MERGE':
                    return 'Credited with ' + assetDetailsToText(e.details.amount, e.details.asset_type, e.details.asset_code) +
                        ' via an account merge from ' + shortenAddressSpan(e.operation.details.account, withSpan);
                default:
                    return e.type;
            }
        case 'ACCOUNT_DEBITED':
            return accountDebitedMessage(e, withSpan);
        case 'SIGNER_CREATED':
            return 'New signer ' + shortenAddressSpan(e.details.public_key, withSpan) + ' added with weight of ' + e.details.weight;
        case 'SIGNER_UPDATED':
            return 'Signer ' + shortenAddressSpan(e.details.public_key, withSpan) + ' updated with weight of ' + e.details.weight;
        case 'SIGNER_REMOVED':
            return 'Signer ' + shortenAddressSpan(e.details.public_key, withSpan) + ' removed';
        case 'TRUSTLINE_CREATED':
            return 'New trustline limit of ' + e.details.limit + ' for asset ' + e.details.asset_code + ' issued by ' + shortenAddressSpan(e.details.asset_issuer, withSpan);
        case 'TRUSTLINE_UPDATED':
            return 'Trustline limit updated to ' + e.details.limit + ' for asset ' + e.details.asset_code + ' issued by ' + shortenAddressSpan(e.details.asset_issuer, withSpan);
        case 'TRUSTLINE_REMOVED':
            return 'Trustline limit removed for asset ' + e.details.asset_code + ' issued by ' + shortenAddressSpan(e.details.asset_issuer, withSpan);
        case 'TRADE':
            if (e.operation.source === e.details.seller) {
                return 'Traded ' + assetDetailsToText(e.details.bought_amount, e.details.bought_asset_type, e.details.bought_asset_code) +
                    ' for ' + assetDetailsToText(e.details.sold_amount, e.details.sold_asset_type, e.details.sold_asset_code);
            }
            return 'Traded ' + assetDetailsToText(e.details.sold_amount, e.details.sold_asset_type, e.details.sold_asset_code) +
                ' for ' + assetDetailsToText(e.details.bought_amount, e.details.bought_asset_type, e.details.bought_asset_code);
        default:
            return e.type;
    }
}

function accountDebitedMessage(e, withSpan) {
    const {type, details} = e.operation;

    switch (type) {
        case 'PAYMENT':
            // We don't want two alerts coming up every time someone puts an offer in (one for the trade and one for the fee)
            // For the effect history (because we want an entry for the fee as well), just don't include the transaction's memo
            //if (e.operation.transaction.memo === 'offer_via_lupoex') {
            //    return null;
            //}
            return 'Sent payment to ' + shortenAddressSpan(details.to, withSpan) + ' for ' +
                assetDetailsToText(details.amount, details.asset_type, details.asset_code);
        case 'PATH_PAYMENT':
            return 'Sent path payment to ' + shortenAddressSpan(details.to, withSpan) +
                ' via path' + ' -> '  + assetDetailsToText(details.source_amount, details.source_asset_type, details.source_asset_code)
                + details.path.reduce((result, fragment) => {
                    return result + ' -> '  + assetDetailsToText(fragment.amount, fragment.asset_type, fragment.asset_code);
                }, '')
                + ' -> '  + assetDetailsToText(details.amount, details.asset_type, details.asset_code);
        case 'CREATE_ACCOUNT':
            return 'Sent ' + details.starting_balance + ' to create account ' + shortenAddressSpan(details.account, withSpan);
        default:
            return type;
    }
}

function assetDetailsToText(amount, assetType, assetCode) {
    return amount + ' ' + (assetType.toLowerCase() === 'native' ? window.lupoex.stellar.nativeAssetCode : assetCode);
}

function shortenAddressSpan(address, withSpan) {
    return withSpan ? '<span class="shortened-address" title="' + address + '">' + shortenAddress(address) + '</span>' : shortenAddress(address);
}
