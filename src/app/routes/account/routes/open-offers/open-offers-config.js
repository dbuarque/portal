/**
 * Created by Ishai on 4/27/2017.
 */

import {transient, inject} from 'aurelia-framework';
import {FormatNumberValueConverter} from 'app-resources';

@transient()
@inject(FormatNumberValueConverter)
export default class AssetBalancesConfig {

    constructor(formatNumber) {
        return {
            table: {
                columns: [
                    {
                        title: 'Selling',
                        data: 'selling',
                        render(cellData, type, rowData) {
                            return rowData.amount + ' ' + rowData.selling.code + ' (' + rowData.selling.issuer + ')';
                        },
                        searchable: true
                    },
                    {
                        title: 'Buying',
                        data: 'buying',
                        render(cellData, type, rowData) {
                            return (rowData.amount * rowData.price_r) + ' ' + rowData.buying.code + ' (' + rowData.buying.issuer + ')';
                        },
                        searchable: true
                    },
                    {
                        title: 'Price',
                        data: 'price',
                        render(cellData, type, rowData) {
                            return formatNumber(rowData.price) + ' ' + rowData.buying.code + ' ' + rowData.selling.code;
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
