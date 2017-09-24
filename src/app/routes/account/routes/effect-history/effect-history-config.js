/**
 * Created by Ishai on 4/27/2017.
 */

import BigNumber from 'bignumber.js';
import {transient, inject} from 'aurelia-framework';
import {SanitizeHTMLValueConverter} from 'aurelia-templating-resources';
import {FormatDateTimeValueConverter} from 'global-resources';
import {ShortenAddressValueConverter} from 'app-resources';

@transient()
@inject(SanitizeHTMLValueConverter, FormatDateTimeValueConverter, ShortenAddressValueConverter)
export default class EffectHistoryConfig {

    constructor(sanitizeHTML, formatDateTime, shortenAddress) {
        const self = this;
        
        self.shortenAddress = shortenAddress;

        return {
            table: {
                order: [0, 'desc'],
                lengthMenu: [ 10, 25, 100 ],
                serverSide: true,
                searchDelay: 500,
                columns: [
                    {
                        title: 'Date',
                        data: 'operation.transaction.ledger.closedAt',
                        searchable: false,
                        render(cellData, type, rowData) {
                            return formatDateTime.toView(rowData.operation.transaction.ledger.closedAt);
                        }
                    },
                    {
                        title: 'Details',
                        data: 'historyOperationId',
                        searchable: false,
                        orderable: false,
                        className: 'left-align',
                        cellCallback (cell, rowData) {
                            cell.empty();
                            let newHtml = self.effectDetailsHtml(rowData);
                            newHtml = sanitizeHTML.toView(newHtml);
                            cell.html(newHtml);
                        }
                    }
                ]
            }
        };
    }

    effectDetailsHtml(e) {
        return this.effectDetailsIcon(e) + '&nbsp;&nbsp;&nbsp;' + this.effectDetailsText(e);
    }

    effectDetailsIcon(e) {
        switch(e.type) {
            case 'ACCOUNT_CREATED':
                return '<i class="fa fa-lg fa-check success-text">A</i>';
            case 'ACCOUNT_REMOVED':
                return '<i class="fa fa-lg fa-times error-text"></i>';
            case 'ACCOUNT_CREDITED':
                return '<i class="fa fa-lg fa-arrow-left success-text"></i>';
            case 'ACCOUNT_DEBITED':
                return '<i class="fa fa-lg fa-arrow-right error-text"></i>';
            case 'TRADE':
                return '<i class="fa fa-lg fa-exchange primary-text"></i>';
            default:
                return '<i class="fa fa-lg fa-circle-o gray-text"></i>';
        }
    }

    effectDetailsText(e) {
        switch(e.type) {
            case 'ACCOUNT_CREATED':
                return 'Account Created';
            case 'ACCOUNT_REMOVED':
                return 'Account Removed';
            case 'ACCOUNT_CREDITED':
                return 'Received payment from ' + this.shortenAddress.toView(e.operation.details.from) + ' for ' +
                    e.operation.details.amount + ' ' + this._assetDetailsToText(e.operation.details.amount, e.operation.details.asset_type, e.operation.details.asset_code);
            case 'ACCOUNT_DEBITED':
                return this._handleAccountDebited(e);
            case 'TRADE':
                return 'Traded ' + this._assetDetailsToText(e.operation.details.amount, e.operation.details.selling_asset_type, e.operation.details.selling_asset_code) +
                    ' for ' + this._assetDetailsToText((new BigNumber(e.operation.details.amount)).times(e.operation.details.price), e.operation.details.buying_asset_type, e.operation.details.buying_asset_code);
            default:
                return e.type;
        }
    }

    _handleAccountDebited(e) {
        const {type, details} = e.operation;

        switch(type) {
            case 'PAYMENT':
                return 'Send payment to ' + this.shortenAddress.toView(details.to) + ' for ' +
                    this._assetDetailsToText(details.amount, details.asset_type, details.asset_code);
            case 'PATH_PAYMENT':
                return 'Send path payment to ' + this.shortenAddress.toView(details.to) +
                    'via path' + ' -> '  + this._assetDetailsToText(details.source_amount, details.source_asset_type, details.source_asset_code)
                    + details.path.reduce((result, fragment) => {
                        return result + ' -> '  + this._assetDetailsToText(fragment.amount, fragment.asset_type, fragment.asset_code)
                    }, '')
                    + ' -> '  + this._assetDetailsToText(details.amount, details.asset_type, details.asset_code);
            default:
                return '';
        }
    }

    _assetDetailsToText(amount, assetType, assetCode) {
        return amount + ' ' + (assetType === 'native' ? window.lupoex.stellar.nativeAssetCode : assetCode);
    }
}
