import 'font-awesome/css/font-awesome.css';
import './third-party-css';
import '!style-loader!css-loader!sass-loader!./main.scss';
import {AppStore} from 'resources';
import {app as rootReducer} from './app/app-reducers';
import {applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import * as Bluebird from 'bluebird';
Bluebird.config({
    warnings: false
});

import './third-party';

if (Waves) {
    Waves.displayEffect = function() {};
}

export async function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .plugin('aurelia-flatpickr')
        .plugin('aurelia-crumbs')
        .plugin('aurelia-materialize-bridge', bridge => bridge.useAll() )
        .feature('resources');

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

    aurelia.setRoot('app/app', document.body);
}
