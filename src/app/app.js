import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';
import {AppConfig} from './app.config';
import {inject} from 'aurelia-framework';
import {Store} from 'aurelia-redux-connect';
import {WakeEventEmitter} from 'global-resources';
import {JsonClient, PageTracker, AccountEffectAlerter, HasAccountStep} from 'app-resources';
import {UpdateAccountActionCreator, UpdateBip32PathActionCreator} from './action-creators';

@inject(AppConfig, EventAggregator, Router, Store, WakeEventEmitter, JsonClient, PageTracker, AccountEffectAlerter, UpdateAccountActionCreator, UpdateBip32PathActionCreator)
export class App {
    constructor(appConfig, eventAggregator, router, store, wakeEventEmitter, jsonClient, pageTracker, accountEffectAlerter, updateAccount, updateBip32Path) {
        this.config = appConfig;
        this.eventAggregator = eventAggregator;
        this.router = router;
        this.store = store;
        this.jsonClient = jsonClient;
        this.pageTracker = pageTracker;

        this.jsonClient.configure();

        // We only want to enable page refresh on wake outside of development because pausing the debugger
        // on a breakpoint will trigger a "wake" event and refresh the page (which can get VERY annoying).
        if (window.stellarport.env !== 'development') {
            // Ensure that the wake event will get published to the eventAggregator if the browser comes back from sleep.
            wakeEventEmitter.init();

            // Handle the wake event.
            eventAggregator.subscribe('wake', () => {
                location.reload();
            });
        }

        accountEffectAlerter.init();

        updateAccount.initFromStore();
        updateBip32Path.initFromStore();
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.registerNavigationPipelineSteps(routerConfig);

        this.router = router;

        this.router.transformTitle = title => 'Stellarport';
    }

    activate() {
        if (window.stellarport.env !== 'development') {
            this.pageTracker.init();
        }
    }

    registerNavigationPipelineSteps(routerConfig) {
        routerConfig.addPipelineStep('authorize', HasAccountStep);
    }
}
