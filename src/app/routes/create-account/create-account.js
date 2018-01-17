import './create-account.scss';
import {inject} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {IncrementStepActionCreator, UpdateStepIndexActionCreator} from './action-creators';
import {CreateAccountConfig} from './create-account.config';

@inject(CreateAccountConfig, IncrementStepActionCreator, UpdateStepIndexActionCreator)
export class CreateAccount {
    @connected('createAccount.stepIndex')
    stepIndex;

    @connected('createAccount.canProceed')
    canProceed;

    constructor(config, incrementStep, updateStepIndex) {
        this.config = config;
        this.incrementStep = incrementStep;
        this.updateStepIndex = updateStepIndex;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => 'Stellarport';
    }

    bind() {
        this.updateStepIndex.dispatch(0);
    }
}
