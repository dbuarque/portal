/**
 * Created by istrauss on 11/25/2016.
 */

import jQuery from 'jquery';
import * as d3 from 'd3';
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import * as Bluebird from 'bluebird';
import moment from 'moment';
import * as StellarSdk from 'stellar-sdk';

// setup some globals:
window.$ = jQuery;
window.jQuery = jQuery;
window.d3 = d3;
// Instantiate the socket client (`io`)
// (for now, you must explicitly pass in the socket.io client when using this library from Node.js)
window.io = sailsIOClient(socketIOClient);
//window.io.sails.useCORSRouteToGetCookie = false;

// bluebird configuration
Bluebird.config({
    warnings: false
});

// moment configuration
moment.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: '%ds',
        ss: '%ds',
        m: '%dm',
        mm: '%dm',
        h: '%dh',
        hh: '%dh',
        d: '%dd',
        dd: '%dd',
        M: '%dmo',
        MM: '%dmo',
        y: '%dy',
        yy: '%dy'
    }
});

// materialize configuration
try {
    Waves.displayEffect = function() {};
}
catch (e) {}

// sails socket io configuration
window.io.sails.url = window.lupoex.urls.api;
window.io.sails.transports = ['websocket'];

// stellar sdk configuration
if (window.lupoex.networkMode === 'public') {
    StellarSdk.Network.usePublicNetwork();
}
else {
    StellarSdk.Config.setAllowHttp(true);
    StellarSdk.Network.useTestNetwork();
}
