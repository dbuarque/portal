/**
 * Created by Ishai on 3/31/2016.
 */

//import URI from 'urijs';
import {inject} from 'aurelia-framework';
import {Router, Redirect} from 'aurelia-router';
import {AppStore} from 'global-resources';
import {AppActionCreators} from '../../app-action-creators';

@inject(Router, AppStore, AppActionCreators)
export class Login {
    constructor(router, appStore, appActionCreators) {
        this.router = router;
        this.appStore = appStore;
        this.appActionCreators = appActionCreators;
    }

    onLoginSuccess() {
        this.router.navigateToRoute('account');
    }

    canActivate() {
        const account = this.appStore.getState().account;

        if (account && account.id) {
            return new Redirect('exchange');
        }
    }

    activate() {
        if (window.lupoex.env === 'development') {
            this.devAlertConfig = {
                type: 'info',
                message: 'Hey, we noticed you are running in development mode. This site connects to the testnet in development mode. If you have a testnet stellar account, you can use that to login. Otherwise, you can use the following to login <br><ul><li>Public Key: GBLRBO6JT6KKZQ4DGJABW7YPAPTHXWUH5WOU3NPDD4ZPDGTDPAH6ZDQA</li><li>Secret Key: SCLXBMQT3O4NHUQAPTYFQU3KFMO736O2T2ZUSGKYRNX7EBJTSB76E2NC</li></ul>'
            };
        }
    }
}

