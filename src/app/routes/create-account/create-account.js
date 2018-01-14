import './create-account.scss';
import {inject} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {StepBackActionCreator, StepForwardActionCreator} from './action-creators';
import {CreateAccountConfig} from './create-account.config';

@inject(CreateAccountConfig, StepBackActionCreator, StepForwardActionCreator)
export class CreateAccount {
    @connected('createAccount.stepIndex')
    stepIndex;

    @connected('createAccount.canProceed')
    canProceed;

    constructor(config, stepBack, stepForward) {
        this.config = config;
        this.stepBack = stepBack;
        this.stepForward = stepForward;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => 'Stellarport';
    }

    bind() {
        this.router.navigateToRoute('introduction');
    }
}
