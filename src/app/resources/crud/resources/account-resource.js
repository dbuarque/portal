/**
 * Created by istrauss on 5/11/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import BaseResource from './base-resource';
import {AssetUrlValueConverter, AssetPairToUrlValueConverter} from '../value-converters';

@inject(AssetUrlValueConverter, AssetPairToUrlValueConverter)
export class AccountResource extends BaseResource {
    constructor(assetUrl, assetPairToUrl) {
        super('/Account');

        this.assetUrl = assetUrl;
        this.assetPairToUrl = assetPairToUrl;
    }

    /**
     * Gets an account
     * @param accountId
     * @param [options]
     * @param [options.handleError]
     * @returns {*}
     */
    account(accountId, options) {
        return this.get('/' + accountId, {}, options);
    }

    /**
     * Gets the seqnum for an account
     * @param accountId
     * @returns {*}
     */
    seqnum(accountId) {
        return this.get('/' + accountId + '/Seqnum');
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

    async effectsDataTable(accountId, data, settings) {
        const query = this.dataTablePre(data);
        const results = await this.effects(accountId, query);
        return this.dataTablePost(data, results);
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
    async assetPairTrustlines(accountId, assetPair) {
        const values = await Promise.all([
            this.trustline(accountId, assetPair.buying),
            this.trustline(accountId, assetPair.selling)
        ]);

        return {
            buying: values[0],
            selling: values[1]
        };
    }

    trustline(accountId, asset) {
        return this.get('/' + accountId + '/Trustline' + this.assetUrl.toView(asset));
    }
}
