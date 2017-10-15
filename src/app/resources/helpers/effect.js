
import BigNumber from 'bignumber.js';
import {shortenAddress} from "./misc";

export function userFriendlyEffectMessage(e) {
    switch(e.type) {
        case 'ACCOUNT_CREATED':
            return 'Account Created';
        case 'ACCOUNT_REMOVED':
            return 'Account Removed';
        case 'ACCOUNT_CREDITED':
            return 'Received payment from ' + shortenAddress(e.operation.details.from) + ' for ' +
                assetDetailsToText(e.operation.details.amount, e.operation.details.asset_type, e.operation.details.asset_code);
        case 'ACCOUNT_DEBITED':
            return accountDebitedMessage(e);
        case 'SIGNER_CREATED':
            return 'New signer ' + shortenAddress(e.details.public_key) + ' added with weight of ' + e.details.weight;
        case 'SIGNER_UPDATED':
            return 'Signer ' + shortenAddress(e.details.public_key) + ' updated with weight of ' + e.details.weight;
        case 'SIGNER_REMOVED':
            return 'Signer ' + shortenAddress(e.details.public_key) + ' removed';
        case 'TRUSTLINE_CREATED':
            return 'New trustline limit of ' + e.details.limit + ' for asset ' + e.details.asset_code + ' issued by ' + shortenAddress(e.details.asset_issuer);
        case 'TRUSTLINE_UPDATED':
            return 'Trustline limit updated to ' + e.details.limit + ' for asset ' + e.details.asset_code + ' issued by ' + shortenAddress(e.details.asset_issuer);
        case 'TRUSTLINE_REMOVED':
            return 'Trustline limit removed for asset ' + e.details.asset_code + ' issued by ' + shortenAddress(e.details.asset_issuer);
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

function accountDebitedMessage(e) {
    const {type, details} = e.operation;

    switch(type) {
        case 'PAYMENT':
            // We don't want two alerts coming up every time someone puts an offer in (one for the trade and one for the fee)
            // For the effect history (because we want an entry for the fee as well), just don't include the transaction's memo
            if (e.operation.transaction.memo === 'offer_via_lupoex') {
                return null;
            }

            return 'Sent payment to ' + shortenAddress(details.to) + ' for ' +
                assetDetailsToText(details.amount, details.asset_type, details.asset_code);
        case 'PATH_PAYMENT':
            return 'Sent path payment to ' + shortenAddress(details.to) +
                'via path' + ' -> '  + assetDetailsToText(details.source_amount, details.source_asset_type, details.source_asset_code)
                + details.path.reduce((result, fragment) => {
                    return result + ' -> '  + assetDetailsToText(fragment.amount, fragment.asset_type, fragment.asset_code)
                }, '')
                + ' -> '  + assetDetailsToText(details.amount, details.asset_type, details.asset_code);
        default:
            return '';
    }
}

function assetDetailsToText(amount, assetType, assetCode) {
    return amount + ' ' + (assetType === 'native' ? window.lupoex.stellar.nativeAssetCode : assetCode);
}
