/**
 * Created by Ishai on 4/27/2017.
 */

import {transient, inject} from 'aurelia-framework';
import {SanitizeHTMLValueConverter} from 'aurelia-templating-resources';
import {FormatDateTimeValueConverter} from 'global-resources';
import {ShortenAddressValueConverter, userFriendlyEffectMessage} from 'app-resources';

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
        return this.effectDetailsIcon(e) + '&nbsp;&nbsp;&nbsp;' + userFriendlyEffectMessage(e);
    }

    effectDetailsIcon(e) {
        switch(e.type) {
            case 'ACCOUNT_CREATED':
                return '<i class="fa fa-lg fa-check success-text"></i>';
            case 'ACCOUNT_REMOVED':
                return '<i class="fa fa-lg fa-times error-text"></i>';
            case 'ACCOUNT_CREDITED':
                return '<i class="fa fa-lg fa-arrow-left success-text"></i>';
            case 'ACCOUNT_DEBITED':
                return '<i class="fa fa-lg fa-arrow-right error-text"></i>';
            case 'SIGNER_CREATED':
                return '<span><i class="fa fa-gray fa-pencil fa-lg"></i><i class="fa fa-plus success-text fa-sub"></i></span>';
            case 'SIGNER_UPDATED':
                return '<span><i class="fa fa-gray fa-pencil fa-lg"></i><i class="fa fa-arrow-up primary-text fa-sub"></i></span>';
            case 'SIGNER_REMOVED':
                return '<span><i class="fa fa-gray fa-pencil fa-lg"></i><i class="fa fa-times error-text fa-sub"></i></span>';
            case 'TRUSTLINE_CREATED':
                return '<span><i class="fa fa-gray fa-lock fa-lg"></i><i class="fa fa-plus success-text fa-sub"></i></span>';
            case 'TRUSTLINE_UPDATED':
                return '<span"><i class="fa fa-gray fa-lock fa-lg"></i><i class="fa fa-arrow-up primary-text fa-sub"></i></span>';
            case 'TRUSTLINE_REMOVED':
                return '<span><i class="fa fa-gray fa-lock fa-lg"></i><i class="fa fa-times error-text fa-sub"></i></span>';
            case 'TRADE':
                return '<i class="fa fa-lg fa-exchange primary-text"></i>';
            default:
                return '<i class="fa fa-lg fa-circle-o gray-text"></i>';
        }
    }
}
