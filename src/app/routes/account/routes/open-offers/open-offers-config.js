/**
 * Created by Ishai on 4/27/2017.
 */

import {transient, inject} from 'aurelia-framework';
import {FormatDateTimeValueConverter} from 'global-resources';
import {FormatNumberValueConverter} from 'app-resources';
import {IssuerHtmlValueConverter} from '../../account-value-converters';

@transient()
@inject(FormatNumberValueConverter, FormatDateTimeValueConverter, IssuerHtmlValueConverter)
export default class AssetBalancesConfig {

    constructor(formatNumber, formatDateTime, issuerHtml) {
        return {
            table: {
                order: [0, 'desc'],
                lengthMenu: [ 10, 25, 100 ],
                serverSide: true,
                searchDelay: 500,
                columns: [
                    {
                        title: 'Last Modified At',
                        data: 'lastModified',
                        searchable: false,
                        render(cellData, type, rowData) {
                            return formatDateTime.toView(rowData.lastModified);
                        }
                    },
                    {
                        title: 'Offered Asset Code',
                        data: '_sellingAssetCode',
                        searchable: true
                    },
                    {
                        title: 'Offered Asset Issuer',
                        data: 'sellingIssuerId',
                        searchable: true,
                        cellCallback (cell, rowData) {
                            cell.empty();
                            cell.html(
                                issuerHtml.toView(rowData.sellingIssuer)
                            );
                        }
                    },
                    {
                        title: 'Desired Asset Code',
                        data: '_buyingAssetCode',
                        searchable: true
                    },
                    {
                        title: 'Desired Asset Issuer',
                        data: 'buyingIssuerId',
                        searchable: true,
                        cellCallback (cell, rowData) {
                            cell.empty();
                            cell.html(
                                issuerHtml.toView(rowData.buyingIssuer)
                            );
                        }
                    },
                    {
                        title: 'Amount Offered',
                        data: 'amount',
                        searchable: false
                    },
                    {
                        title: 'Price',
                        data: 'price',
                        searchable: false,
                        render(cellData, type, rowData) {
                            return formatNumber.toView(parseFloat(rowData.price, 10)) + ' ' + rowData.sellingAssetCode + '/' + rowData.buyingAssetCode;
                        }
                    },
                    {
                        title: '',
                        defaultContent: '',
                        searchable: false,
                        orderable: false
                    }
                ]
            }
        };
    }
}
