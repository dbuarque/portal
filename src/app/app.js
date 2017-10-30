
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';
import {AppConfig} from './app-config';
import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {WakeEventEmitter} from "global-resources";
import {JsonClient, AuthenticateStep, PageTracker} from 'app-resources';
import {AppActionCreators} from './app-action-creators';
import {AccountEffectAlerter} from './account-effect-alerter';

@inject(AppConfig, HttpClient, EventAggregator, Router, Store, WakeEventEmitter, JsonClient, PageTracker, AppActionCreators, AccountEffectAlerter)
export class App {

    constructor(appConfig, httpClient, eventAggregator, router, store, wakeEventEmitter, jsonClient, pageTracker, appActionCreators, accountEffectAlerter) {
        this.config = appConfig;
        this.eventAggregator = eventAggregator;
        this.router = router;
        this.store = store;
        this.jsonClient = jsonClient;
        this.pageTracker = pageTracker;
        this.appActionCreators = appActionCreators;

        // We only want to enable page refresh on wake outside of development because pausing the debugger
        // on a breakpoint will trigger a "wake" event and refresh the page (which can get VERY annoying).
        if (window.lupoex.env !== 'development') {
            // Ensure that the wake event will get published to the eventAggregator if the browser comes back from sleep.
            wakeEventEmitter.init();

            // Handle the wake event.
            eventAggregator.subscribe('wake', () => {
                location.reload();
            });
        }

        accountEffectAlerter.init();

        httpClient.configure(config => {
            config.useStandardConfiguration();
        });
    }

    configureRouter(routerConfig, router) {
        if (window.lupoex.env !== 'development') {
            this.pageTracker.init();
        }

        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.registerNavigationSteps(routerConfig);

        this.router = router;

        this.router.transformTitle = title => 'LuPoEx';
    }

    activate() {
        this.store.dispatch(this.appActionCreators.updateLupoexAccount());
        this.jsonClient.configure();
    }

    registerNavigationSteps(routerConfig) {
        routerConfig.addPipelineStep('authorize', AuthenticateStep);
    }
}
