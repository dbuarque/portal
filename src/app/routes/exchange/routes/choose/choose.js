/**
 * Created by istrauss on 5/21/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {connected} from 'au-redux';
import {UpdateAssetPairActionCreator} from '../../action-creators';

@inject(Router, UpdateAssetPairActionCreator)
export class Choose {

    @connected('exchange.assetPair')
    assetPair;

    alertConfig = {
        type: 'info',
        message: 'Quick select a market from the table below or select one of the <span class="dashed">dashed</span> assets to search through all available assets.',
        dismissible: false
    };

    constructor(router, updateAssetPair) {
        this.router = router;
        this.updateAssetPair = updateAssetPair;

        this.switchAssets = this._switchAssets.bind(this);
        this.reselect = this._reselect.bind(this);
    }

    goTrade(e) {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        const buyingIsNative = this.assetPair.buying.type.toLowerCase() === 'native';
        const sellingIsNative = this.assetPair.selling.type.toLowerCase() === 'native';

        this.router.navigateToRoute('detail', {
            buyingType: this.assetPair.buying.type.replace('credit_', ''),
            buyingCode: buyingIsNative ? nativeAssetCode : this.assetPair.buying.code,
            buyingIssuer: buyingIsNative ? 'Stellar' : this.assetPair.buying.issuer.accountId,
            sellingType: this.assetPair.selling.type.replace('credit_', ''),
            sellingCode: sellingIsNative ? nativeAssetCode : this.assetPair.selling.code,
            sellingIssuer: sellingIsNative ? 'Stellar' : this.assetPair.selling.issuer.accountId
        });
    }

    _reselect(asset, type) {
        this.updateAssetPair.dispatch({
            [type]: asset
        });
    }

    _switchAssets() {
        this.updateAssetPair.dispatch({
            buying: this.assetPair.selling,
            selling: this.assetPair.buying
        });
    }
}
