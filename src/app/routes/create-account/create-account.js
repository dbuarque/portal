import './create-account.scss';
import {inject} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {CreateAccountConfig} from './create-account.config';

@inject(CreateAccountConfig)
export class CreateAccount {
    @connected('createAccount.stepIndex')
    stepIndex;

    constructor(config) {
        this.config = config;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => 'Stellarport';
    }
}
