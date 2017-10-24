
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
        if (!issuer || !issuer.homeDomain) {
            return null;
        }

        this.issuerTomls[issuer.homeDomain] = this.issuerTomls[issuer.homeDomain] ||
            await this.stellarServer.sdk.StellarTomlResolver.resolve(issuer.homeDomain);

        return this.issuerTomls[issuer.homeDomain];
    }

    async assetToml(issuer, assetCode) {
        if (!issuer || !assetCode) {
            return null;
        }

        const issuerToml = await this.issuerToml(issuer);
        return _find(issuerToml.CURRENCIES, currency => currency.issuer === issuer.accountId && currency.code === assetCode);
    }
}
