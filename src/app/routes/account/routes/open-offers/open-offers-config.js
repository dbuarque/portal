/**
 * Created by Ishai on 4/27/2017.
 */

import {transient, inject} from 'aurelia-framework';
import {FormatNumberValueConverter, OrderAmountValueConverter} from 'app-resources';

@transient()
@inject(FormatNumberValueConverter, OrderAmountValueConverter)
export default class AssetBalancesConfig {

    constructor(formatNumber, orderAmount) {
        return {
            table: {
                columns: [
                    {
                        title: 'Selling',
                        data: 'selling',
                        render(cellData, type, rowData) {
                            return rowData.amount + ' ' + assetLabel(rowData.selling);
                        },
                        searchable: true
                    },
                    {
                        title: 'Buying',
                        data: 'buying',
                        render(cellData, type, rowData) {
                            return orderAmount.toView(rowData, true, false) + ' ' + assetLabel(rowData.buying);
                        },
                        searchable: true
                    },
                    {
                        title: 'Price',
                        data: 'price',
                        render(cellData, type, rowData) {
                            return formatNumber.toView(parseFloat(rowData.price, 10)) + ' ' + assetCode(rowData.selling) + '/' + assetCode(rowData.buying);
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

function assetLabel (asset) {
    return asset.asset_type === 'native' ? window.lupoex.stellar.nativeAssetCode + '(Native)' : asset.asset_code + '(' + asset.asset_issuer + ')';
}

function assetCode(asset) {
    return asset.asset_type === 'native' ? window.lupoex.stellar.nativeAssetCode : asset.asset_code ;
}

