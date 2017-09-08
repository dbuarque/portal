/**
 * Created by istrauss on 11/25/2016.
 */

import jQuery from 'jquery';
import * as d3 from 'd3';
import 'sails.io.js-dist';
//import moment from 'moment';

window.$ = jQuery;
window.jQuery = jQuery;
window.d3 = d3;
//window.moment = moment;

io.sails.url = window.lupoex.urls.api;
io.sails.useCORSRouteToGetCookie = false;
