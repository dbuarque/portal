/**
 * Created by Ishai on 4/27/2017.
 */

import {transient, inject} from 'aurelia-framework';

@transient()
export default class AssetBalancesConfig {

    constructor() {
        return {
            table: {
                columns: [
                    {
                        title: 'Balance',
                        data: 'balance',
                        searchable: false
                    },
                    {
                        title: 'Code',
                        data: 'asset_code',
                        render(cellData, type, rowData) {
                            return rowData.asset_type === 'native' ? 'XLM' : rowData.asset_code;
                        },
                        searchable: true
                    },
                    {
                        title: 'Issuer',
                        render(cellData, type, rowData) {
                            return rowData.asset_type === 'native' ? '' : rowData.asset_issuer;
                        },
                        searchable: true
                    },
                    {
                        title: 'Trust Limit',
                        render(cellData, type, rowData) {
                            return rowData.asset_type === 'native' ? '' : rowData.limit;
                        },
                        searchable: true
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
