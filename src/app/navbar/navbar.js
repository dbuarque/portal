/**
 * Created by Ishai on 3/27/2016.
 */
import {bindable, inject, computedFrom} from 'aurelia-framework';
import {Store, connected} from 'au-redux';
import {AlertToaster} from 'global-resources';
import {AppActionCreators} from '../app-action-creators';

@inject(Store, AppActionCreators, AlertToaster)
export class Navbar {

    @connected('myAccount')
    account;
    
    @connected('exchange.assetPair')
    assetPair;

    @bindable router;

    @computedFrom('account')
    get firstFive() {
        return this.account && this.account.accountId ? this.account.accountId.slice(0, 5) : null;
    }

    constructor(store, appActionCreators, toaster) {
        this.store = store;
        this.appActionCreators = appActionCreators;
        this.toaster = toaster;
    }

    goToExchangeChoose() {
        this.router.navigateToRoute('exchange');
    }

    goToExchangeDetail() {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        const buyingIsNative = this.assetPair.buying.type.toLowerCase() === 'native';
        const sellingIsNative = this.assetPair.selling.type.toLowerCase() === 'native';
        const buyingType = this.assetPair.buying.type;
        const buyingCode = buyingIsNative ? nativeAssetCode : this.assetPair.buying.code;
        const buyingIssuer = buyingIsNative ? 'Stellar': this.assetPair.buying.issuer.accountId;
        const sellingType = this.assetPair.selling.type;
        const sellingCode = sellingIsNative ? nativeAssetCode : this.assetPair.selling.code;
        const sellingIssuer = sellingIsNative ? 'Stellar': this.assetPair.selling.issuer.accountId;
        
        const route = this.router.generate('exchange') +
            '/' + sellingType + '/' + sellingCode + '/' + sellingIssuer +
            '/' + buyingType + '/' + buyingCode + '/' + buyingIssuer;

        this.router.navigate(route);
    }

    login() {
        this.router.navigateToRoute('login');
    }

    logout() {
        this.store.dispatch(this.appActionCreators.updateAccount());
        this.toaster.primary('Logged out successfully.');
    }

    goToAccount() {
        this.router.navigateToRoute('account');
    }
}
