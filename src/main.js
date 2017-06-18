import './main-config';
import {PLATFORM} from 'aurelia-pal';
import 'font-awesome/css/font-awesome.css';
import './third-party-css';
import '!style-loader!css-loader!sass-loader!./main.scss';
import {AppStore} from 'global-resources';
import {app as rootReducer} from './app/app-reducers';
import {applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import * as Bluebird from 'bluebird';
Bluebird.config({
    warnings: false
});

import './third-party';

try {
    Waves.displayEffect = function() {};
}
catch(e) {}

export async function configure(aurelia) {
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
                .useProgress()
                .useRadio()
                .useSelect()
                .useSwitch()
                .useTabs()
                .useTooltip()
                .useWaves();
        } )
        .feature(PLATFORM.moduleName('resources/index'))
        .feature(PLATFORM.moduleName('app/resources/index'));

    if (window.lupoex.env === 'development') {
        aurelia.use
            .developmentLogging();
    }

    await aurelia.start();

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

    AppStore.createAndRegister(rootReducer, enhancer);

    await aurelia.setRoot(PLATFORM.moduleName('app/app'));
}
