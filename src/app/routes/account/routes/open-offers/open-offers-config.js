/**
 * Created by Ishai on 4/27/2017.
 */

import {transient, inject} from 'aurelia-framework';
import {FormatDateTimeValueConverter} from 'global-resources';
import {FormatNumberValueConverter, OrderAmountValueConverter} from 'app-resources';

@transient()
@inject(FormatNumberValueConverter, FormatDateTimeValueConverter)
export default class AssetBalancesConfig {

    constructor(formatNumber, formatDateTime) {
        return {
            table: {
                order: [0, 'desc'],
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
                        data: 'sellingAssetCode',
                        searchable: true
                    },
                    {
                        title: 'Offered Asset Issuer',
                        data: 'sellingIssuer',
                        searchable: true
                    },
                    {
                        title: 'Desired Asset Code',
                        data: 'buyingAssetCode',
                        searchable: true
                    },
                    {
                        title: 'Desired Asset Issuer',
                        data: 'buyingIssuer',
                        searchable: true
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

function assetLabel (asset) {
    return asset.asset_type === 'native' ? window.lupoex.stellar.nativeAssetCode + '(Native)' : asset.asset_code + '(' + asset.asset_issuer + ')';
}

function assetCode(asset) {
    return asset.asset_type === 'native' ? window.lupoex.stellar.nativeAssetCode : asset.asset_code ;
}

