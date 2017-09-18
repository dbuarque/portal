/**
 * Created by istrauss on 9/16/2017.
 */

import {inject} from 'aurelia-framework';
import {AlertToaster} from 'global-resources';
import {AccountStream} from './account-stream';

@inject(AlertToaster, AccountStream)
export class AccountEffectAlerter {

    constructor(alertToaster, accountStream) {
        this.alertToaster = alertToaster;
        this.accountStream = accountStream;
    }

    init() {
        this.accountStream.subscribe(this._handleAccountEffects.bind(this))
    }

    _handleAccountEffects(msg) {
        if (msg.type !== 'effects') {
            return;
        }

        const alerts = this._alertsFromEffects(msg.payload);

        alerts.forEach(a => {
            this.alertToaster[a.type](a.msg);
        });
    }

    _alertsFromEffects(effects) {
        return effects
            .map(e => {
                switch(e.type) {
                    case 'ACCOUNT_CREDITED':
                        return this._handleAccountCredited(e);
                    case 'ACCOUNT_DEBITED':
                        return this._handleAccountDebited(e);
                    case 'TRADE':
                        return this._handleTrade(e);
                    default:
                        return null;
                }
            })
            .filter(alert => !!alert);
    }

    _handleAccountCredited(e) {
        const alert = {
            type: 'success'
        };
        const {type, details} = e.operation;

        switch(type) {
            case 'PAYMENT':
            case 'PATH_PAYMENT':
                alert.msg = 'Received payment from ' + details.from.slice(0, 6) + ' for ' +
                    details.amount + ' ' + this._assetDetailsToText(details.amount, details.asset_type, details.asset_code);
                break;
            default:
                return null;
        }

        return alert;
    }

    _handleAccountDebited(e) {
        const alert = {
            type: 'success'
        };
        const {type, details} = e.operation;

        switch(type) {
            case 'PAYMENT':
                // We don't want two alerts coming up every time someone puts an offer in (one for the trade and one for the fee)
                if (e.operation.transaction.memo === 'offer_via_lupoex') {
                    return null;
                }

                alert.msg = 'Send payment to ' + details.to.slice(0, 6) + ' for ' +
                    this._assetDetailsToText(details.amount, details.asset_type, details.asset_code);
                break;
            case 'PATH_PAYMENT':
                alert.msg = 'Send path payment to ' + details.to.slice(0, 6) +
                    'via path' + ' -> '  + this._assetDetailsToText(details.source_amount, details.source_asset_type, details.source_asset_code)
                    + details.path.reduce((result, fragment) => {
                        return result + ' -> '  + this._assetDetailsToText(fragment.amount, fragment.asset_type, fragment.asset_code)
                    }, '')
                    + ' -> '  + this._assetDetailsToText(details.amount, details.asset_type, details.asset_code);
                break;
            default:
                return null;
        }

        return alert;
    }

    _handleTrade(e) {
        const alert = {
            type: 'success'
        };
        const type = e.operation.type;
        const details = e.details;

        switch(type) {
            case 'MANAGE_OFFER':
                alert.msg = 'Traded ' + this._assetDetailsToText(details.sold_amount, details.sold_asset_type, details.sold_asset_code) + 
                    ' for ' + this._assetDetailsToText(details.bought_amount, details.bought_asset_type, details.bought_asset_code);
                break;
            default:
                return null;
        }

        return alert;
    }

    _assetDetailsToText(amount, assetType, assetCode) {
        return amount + ' ' + (assetType === 'native' ? window.lupoex.stellar.nativeAssetCode : assetCode);
    }
}