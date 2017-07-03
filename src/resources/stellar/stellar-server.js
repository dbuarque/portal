/**
 * Created by istrauss on 3/16/2017.
 */

export class StellarServer {
    constructor() {
        if (window.lupoex.networkMode === 'public') {
            StellarSdk.Network.usePublicNetwork();
        }
        else {
            StellarSdk.Config.setAllowHttp(true);
            StellarSdk.Network.useTestNetwork();
        }

        const server = new StellarSdk.Server(window.lupoex.urls.horizon);
        server.sdk = StellarSdk;

        return server;
    }
}
