/**
 * Created by istrauss on 3/16/2017.
 */

export class StellarServer {
    constructor() {
        const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        server.sdk = StellarSdk;
        return server;
    }
}
