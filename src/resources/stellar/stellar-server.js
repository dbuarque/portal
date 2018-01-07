/**
 * Created by istrauss on 3/16/2017.
 */

import * as StellarSdk from 'stellar-sdk';

export class StellarServer {
    constructor() {
        if (window.stellarport.networkMode === 'public') {
            StellarSdk.Network.usePublicNetwork();
        }
        else {
            StellarSdk.Config.setAllowHttp(true);
            StellarSdk.Network.useTestNetwork();
        }

        const server = new StellarSdk.Server(window.stellarport.urls.horizon);
        server.sdk = StellarSdk;

        return server;
    }
}
