/**
 * Created by istrauss on 3/16/2017.
 */

import StellarSdk from 'js-stellar-sdk';

export class StellarServer {
    constructor() {
        const server = new StellarSdk.Server(window.lupoex.horizon);
        server.sdk = StellarSdk;
        return server;
    }
}
