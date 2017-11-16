import {PLATFORM} from 'aurelia-pal';
import 'font-awesome/css/font-awesome.css';
import './third-party-css';
import 'babel-polyfill';
import './main-config';
import './main.scss';
import moment from 'moment';
import {Store} from 'au-redux';
import {app as rootReducer} from './app/reducers';
import {applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import * as Bluebird from 'bluebird';
Bluebird.config({
    warnings: false
});

import './third-party';

moment.updateLocale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s ago",
        s  : '%ds',
        ss : '%ds',
        m:  "%dm",
        mm: "%dm",
        h:  "%dh",
        hh: "%dh",
        d:  "%dd",
        dd: "%dd",
        M:  "%dmo",
        MM: "%dmo",
        y:  "%dy",
        yy: "%dy"
    }
});

try {
    Waves.displayEffect = function() {};
}
catch(e) {}

export async function configure(aurelia) {
    //Create the store
    const middleware = [thunk];

    const composeEnhancers =
        window.lupoex.env === 'development' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                // Specify here name, actionsBlacklist, actionsCreators and other options
            }) : compose;

    const enhancer = composeEnhancers(
        applyMiddleware(...middleware)
        // other store enhancers if any
    );

    Store.createAndRegister(rootReducer, enhancer);
    aurelia.use
        .defaultBindingLanguage()
        .defaultResources()
        .history()
        .router()
        .eventAggregator()
        .plugin(PLATFORM.moduleName('aurelia-crumbs'))
        .plugin(PLATFORM.moduleName('aurelia-materialize-bridge'), bridge => {
            return bridge
                .useCheckbox()
                .useDropdown()
                .useRadio()
                .useSidenav()
                .useSelect()
                .useSwitch()
                .useTabs()
                .useTooltip()
                .useTransitions()
                .useWaves();
        })
        .feature(PLATFORM.moduleName('resources/index'))
        .feature(PLATFORM.moduleName('app/resources/index'));

    if (window.lupoex.env === 'development') {
        aurelia.use
            .developmentLogging();
    }

    await aurelia.start();

    await aurelia.setRoot(PLATFORM.moduleName('app/app'));
}
