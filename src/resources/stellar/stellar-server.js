/**
 * Created by istrauss on 3/16/2017.
 */

export class StellarServer {
    constructor() {
        const server = new StellarSdk.Server(window.lupoex.urls.horizon);
        server.sdk = StellarSdk;

        if (window.lupoex.env === 'production') {
            server.sdk.Network.usePublicNetwork();
        }
        else {
            server.sdk.Network.useTestNetwork();
        }

        return server;
    }
}
