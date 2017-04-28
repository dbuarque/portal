/**
 * Created by Ishai on 4/27/2017.
 */

import {transient} from 'aurelia-framework';

@transient()
export default class AssetBalancesConfig {

    constructor() {
        return {
            table: {
                columns: [
                    {
                        title: 'Balance',
                        data: 'balance',
                        searchable: true
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
                        data: 'asset_issuer',
                        render(cellData, type, rowData) {
                            return rowData.asset_type === 'native' ? '' : rowData.asset_issuer;
                        },
                        searchable: true
                    }//,
                    //{
                    //    title: '',
                    //    defaultContent: '',
                    //    searchable: false,
                    //    orderable: false
                    //}
                ]
            }
        };
    }
}
