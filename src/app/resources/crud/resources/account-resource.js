/**
 * Created by istrauss on 5/11/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import BaseResource from './base-resource';
import {AssetPairToUrlValueConverter} from '../value-converters';

@inject(AssetPairToUrlValueConverter)
export class AccountResource extends BaseResource {
    constructor(assetPairToUrl) {
        super('/Account');

        this.assetPairToUrl = assetPairToUrl;
    }

    /**
     * Gets an account
     * @param accountId
     * @returns {*}
     */
    account(accountId) {
        return this.get('/' + accountId);
    }

    /**
     * Gets effects for an account
     * @param accountId
     * @param [query]
     * @param [query.limit] The number of results to return (MAX 100)
     * @param [query.offset] The number of results to skip
     * @returns {*}
     */
    effects(accountId, query) {
        return this.get('/' + accountId + '/Effects', query)
    }

    /**
     * Gets balances for an account
     * @param accountId
     * @param [query]
     * @param [query.limit] The number of results to return (MAX 100)
     * @param [query.offset] The number of results to skip
     * @returns {*}
     */
    trustlines(accountId, query) {
        return this.get('/' + accountId + '/Trustlines', query)
    }

    async trustlinesDataTable(accountId, data, settings) {
        const query = this.dataTablePre(data);
        const results = await this.trustlines(accountId, query);
        return this.dataTablePost(data, results);
    }

    /**
     * Gets offers for an account
     * @param accountId
     * @param [query]
     * @param [query.limit] The number of results to return (MAX 100)
     * @param [query.offset] The number of results to skip
     * @returns {*}
     */
    offers(accountId, query) {
        return this.get('/' + accountId + '/Offers', query)
    }

    async offersDataTable(accountId, data, settings) {
        const query = this.dataTablePre(data);
        const results = await this.offers(accountId, query);
        return this.dataTablePost(data, results);
    }

    /**
     * Gets account data for an account
     * @param accountId
     * @param [query]
     * @param [query.limit] The number of results to return (MAX 100)
     * @param [query.offset] The number of results to skip
     * @returns {*}
     */
    accountData(accountId, query) {
        return this.get('/' + accountId + '/AccountData', query)
    }

    /**
     * Gets the offers for an account for a specific market
     * @param accountId
     * @param assetPair
     * @returns {*}
     */
    offersForMarket(accountId, assetPair) {
        return this.get('/' + accountId + '/Offers' + this.assetPairToUrl.toView(assetPair));
    }

    /**
     * Gets the trustlines for an account for a specific market
     * @param accountId
     * @param assetPair
     * @returns {*}
     */
    assetPairTrustlines(accountId, assetPair) {
        return this.get('/' + accountId + '/Trustlines' + this.assetPairToUrl.toView(assetPair));
    }
}
