/**
 * Created by istrauss on 4/22/2016.
 */

import './account.scss';
import {inject, computedFrom} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {AccountConfig} from './account.config';

@inject(AccountConfig)
export class Account {
    @connected('myAccount')
    account;

    @computedFrom('router.currentInstruction')
    get currentViewModel() {
        return this.router.currentInstruction ?
            this.router.currentInstruction.viewPortInstructions.default.component.viewModel :
            null;
    }

    constructor(config) {
        this.config = config;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => false;
    }

    activate() {
        this.hideSidebarIfSmall();
    }

    hideSidebarIfSmall() {
        if ($( window ).width() <= 768) {
            this.sidebarHidden = true;
        }
    }

    refresh() {
        if (!this.currentViewModel || this.currentViewModel.refreshing) {
            return;
        }

        this.currentViewModel.refresh();
    }
}
