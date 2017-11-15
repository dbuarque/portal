
import _find from 'lodash/find';
import {inject} from 'aurelia-framework';
import {StellarServer} from 'global-resources';

@inject(StellarServer)
export class TomlCache {

    promises = {};

    constructor(stellarServer) {
        this.stellarServer = stellarServer;
    }

    refresh() {
        this.promises = {};
    }

    issuerToml(issuer) {
        if (!issuer || !issuer.homeDomain) {
            return null;
        }

        if (!this.promises[issuer.homeDomain]) {
            this.promises[issuer.homeDomain] = this.stellarServer.sdk.StellarTomlResolver.resolve(issuer.homeDomain)
                .catch(e => null);
        }

        return this.promises[issuer.homeDomain];
    }

    async assetToml(issuer, assetCode) {
        if (!issuer || !assetCode) {
            return null;
        }

        const issuerToml = await this.issuerToml(issuer);
        return issuerToml && issuerToml.CURRENCIES?
            _find(issuerToml.CURRENCIES, currency => currency.issuer === issuer.accountId && currency.code === assetCode) :
            null;
    }
}
