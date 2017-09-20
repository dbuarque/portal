/**
 * Created by Ishai on 4/27/2017.
 */

import {transient, inject} from 'aurelia-framework';

@transient()
export default class AssetBalancesConfig {

    constructor() {
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

                            let newHtml = '';
                            newHtml += rowData.issuer.homeDomain ? '<div class="primary-text left-align">' + rowData.issuer.homeDomain + '</div>' : '<div class="left-align">Unknown</div>';
                            newHtml += '<div class="left-align" style="font-size: 10px;">' + rowData.issuer.accountId + '</div>';

                            cell.html(newHtml);
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
                        data: 'trustLimit',
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
