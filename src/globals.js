/**
 * Created by istrauss on 11/25/2016.
 */

import jQuery from 'jquery';
import * as d3 from 'd3';
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';

// Instantiate the socket client (`io`)
// (for now, you must explicitly pass in the socket.io client when using this library from Node.js)
window.io = sailsIOClient(socketIOClient);

window.$ = jQuery;
window.jQuery = jQuery;
window.d3 = d3;
//window.moment = moment;

window.io.sails.url = window.lupoex.urls.api;
window.io.sails.useCORSRouteToGetCookie = false;
