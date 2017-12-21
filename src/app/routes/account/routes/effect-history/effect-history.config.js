/**
 * Created by Ishai on 4/27/2017.
 */

import {transient, inject} from 'aurelia-framework';
import {SanitizeHTMLValueConverter} from 'aurelia-templating-resources';
import {FormatDateTimeValueConverter} from 'global-resources';
import {ShortenAddressValueConverter, userFriendlyEffectMessage} from 'app-resources';

@transient()
@inject(SanitizeHTMLValueConverter, FormatDateTimeValueConverter, ShortenAddressValueConverter)
export class EffectHistoryConfig {
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
                        cellCallback(cell, rowData) {
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
        switch (e.type) {
            case 'ACCOUNT_CREATED':
                return '<i class="fal fa-lg fa-check success-text"></i>';
            case 'ACCOUNT_REMOVED':
                return '<i class="fal fa-lg fa-times error-text"></i>';
            case 'ACCOUNT_CREDITED':
                return '<i class="fal fa-lg fa-arrow-left success-text"></i>';
            case 'ACCOUNT_DEBITED':
                return '<i class="fal fa-lg fa-arrow-right error-text"></i>';
            case 'SIGNER_CREATED':
                return '<span class="fa-lg fa-layers fa-gray"><i class="fal fa-pencil"></i><i class="fas fa-plus success-text" data-fa-transform="shrink-8 down-8 right-8"></i></span>';
            case 'SIGNER_UPDATED':
                return '<span class="fa-lg fa-layers fa-gray"><i class="fal fa-pencil"></i><i class="fas fa-arrow-up primary-text" data-fa-transform="shrink-8 down-8 right-8"></i></span>';
            case 'SIGNER_REMOVED':
                return '<span class="fa-lg fa-layers fa-gray"><i class="fal fa-pencil"></i><i class="fas fa-times error-text" data-fa-transform="shrink-8 down-8 right-8"></i></span>';
            case 'TRUSTLINE_CREATED':
                return '<span class="fa-lg fa-layers fa-gray"><i class="fal fa-handshake"></i><i class="fas fa-plus success-text" data-fa-transform="shrink-8 down-8 right-8"></i></span>';
            case 'TRUSTLINE_UPDATED':
                return '<span class="fa-lg fa-layers fa-gray"><i class="fal fa-handshake"></i><i class="fas fa-arrow-up primary-text" data-fa-transform="shrink-8 down-8 right-8"></i></span>';
            case 'TRUSTLINE_REMOVED':
                return '<span class="fa-lg fa-layers fa-gray"><i class="fal fa-handshake"></i><i class="fas fa-times error-text" data-fa-transform="shrink-8 down-8 right-8"></i></span>';
            case 'TRADE':
                return '<i class="fal fa-lg fa-exchange primary-text"></i>';
            default:
                return '<i class="fal fa-lg fa-circle gray-text"></i>';
        }
    }
}

