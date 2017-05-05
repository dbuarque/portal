/**
 * Created by Ishai on 5/2/2017.
 */

import {inject} from 'aurelia-framework';
import Config from './operation-history-config';

@inject(Config)
export class OperationHistory {

    constructor(config) {
        this.config = config;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;
    }

    refresh() {
        const currentViewModel = this.router.currentInstruction.viewPortInstructions.default.controller.viewModel;
        return currentViewModel.refresh();
    }

    get refreshing() {
        const currentViewModel = this.router.currentInstruction.viewPortInstructions.default.controller.viewModel;
        return currentViewModel.refreshing;
    }
}