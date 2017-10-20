
import _find from 'lodash/find';
import {inject} from 'aurelia-framework';
import {StellarServer} from 'global-resources';

@inject(StellarServer)
export class TomlCache {

    issuerTomls = {};

    constructor(stellarServer) {
        this.stellarServer = stellarServer;
    }

    refresh() {
        this.issuerTomls = {};
    }

    async issuerToml(issuer) {
        if (!issuer || !issuer.homedomain) {
            return null;
        }

        this.issuerTomls[issuer.homedomain] = this.promises[issuer.homedomain] ||
            await this.stellarServer.sdk.StellarTomlResolver.resolve(issuer.homedomain);

        return this.issuerTomls[issuer.homedomain];
    }

    async assetToml(issuer, assetCode) {
        const issuerToml = await this.issuerToml(issuer);
        return _find(issuerToml.CURRENCIES, currency => currency.issuer === issuer.accountid && currency.code === assetCode);
    }
}
