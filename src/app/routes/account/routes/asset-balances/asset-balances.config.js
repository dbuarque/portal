/**
 * Created by Ishai on 4/27/2017.
 */

import {transient} from 'aurelia-framework';
import {issuerElement} from '../../resources';

@transient()
export class AssetBalancesConfig {
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
                        cellCallback(cell, rowData) {
                            cell.empty();
                            cell.append(
                                issuerElement(rowData.issuer)
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
                        width: 100,
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
