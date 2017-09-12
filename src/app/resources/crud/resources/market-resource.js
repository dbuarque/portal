/**
 * Created by istrauss on 5/11/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import {ModalService} from 'global-resources';
import BaseResource from './base-resource';
import {AssetPairToUrlValueConverter} from '../value-converters';

@inject(ModalService, AssetPairToUrlValueConverter)
export default class MarketResource extends BaseResource {
    constructor(modalService, assetPairToUrl) {
        super('/Market');

        this.modalService = modalService;
        this.assetPairToUrl = assetPairToUrl;
    }

    /**
     * Gets the top then markets (when ordered by order).
     * @param [order='trade_count'] - API defaults ordering to trade_count (you get the top ten markets by trade_count)
     * @returns {*}
     */
    topTen(order) {
        return this.get('/TopTen', {
            order
        });
    }

    /**
     * Finds a single market
     * @param assetPair
     * @returns {*}
     */
    findOne(assetPair) {
        return this.get(this.assetPairToUrl.toView(assetPair) + '/FindOne');
    }

    /**
     * Finds a single market
     * @param assetPair
     * @returns {*}
     */
    orderbook(assetPair) {
        return this.get(this.assetPairToUrl.toView(assetPair) + '/Orderbook');
    }

    /**
     * Gets a list of ticker data.
     * @param resolution
     * @param assetPair
     * @param [from]
     * @param [to]
     * @returns {*}
     */
    bars(resolution, assetPair, from, to) {
        const action = this.assetPairToUrl.toView(assetPair) + '/Bars';
        return this.get(action, {
            resolution,
            from,
            to
        });
    }

    /**
     * Gets a list of ticker data.
     * @param resolution
     * @param assetPair
     * @param [priorto]
     * @returns {*}
     */
    lastPriorBar(resolution, assetPair, priorto) {
        const action = this.assetPairToUrl.toView(assetPair) + '/LastPriorBar';
        return this.get(action, {
            resolution,
            priorto
        });
    }
}
