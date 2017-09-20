/**
 * Created by Ishai on 4/27/2017.
 */

import {transient, inject} from 'aurelia-framework';
import {IssuerHtmlValueConverter} from '../../account-value-converters';

@transient()
@inject(IssuerHtmlValueConverter)
export default class AssetBalancesConfig {

    constructor(issuerHtml) {
        return {
            table: {
                lengthMenu: [ 10, 25, 100 ],
                serverSide: true,
                searchDelay: 500,
                columns: [
                    {
                        title: 'Code',
                        data: 'assetCode',
                        searchable: true
                    },
                    {
                        title: 'Issuer',
                        data: 'issuerId',
                        cellCallback (cell, rowData) {
                            cell.empty();
                            cell.html(
                                issuerHtml.toView(rowData.issuer)
                            );
                        },
                        orderable: false,
                        searchable: true
                    },
                    {
                        title: 'Balance',
                        data: 'balance',
                        searchable: false
                    },
                    {
                        title: 'Trust Limit',
                        data: '_trustLimit',
                        render(cellData, type, rowData) {
                            return rowData.trustLimit;
                        },
                        searchable: false
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
