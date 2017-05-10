/**
 * Created by istrauss on 5/11/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import {ModalService} from 'global-resources';
import BaseResource from './base-resource';

@inject(ModalService)
export default class TickerResource extends BaseResource {
    constructor(modalService) {
        super('/Ticker');

        this.modalService = modalService;
    }

    /**
     * Gets a list of ticker data.
     * @param interval
     * @param assetPair
     * @param [start]
     * @param [end]
     * @returns {*}
     */
    list(interval, assetPair, start, end) {
        return this.get('/List', {
            interval,
            boughtAssetCode: assetPair.buying.code,
            boughtAssetIssuer: assetPair.buying.issuer || undefined,
            soldAssetCode: assetPair.selling.code,
            soldAssetIssuer: assetPair.selling.issuer || undefined,
            start,
            end
        });
    }

    /**
     * Gets a list of ticker data.
     * @param interval
     * @param assetPair
     * @param before
     * @returns {*}
     */
    lastPrevious(interval, assetPair, before) {
        return this.get('/LastPrevious', {
            interval,
            boughtAssetCode: assetPair.buying.code,
            boughtAssetIssuer: assetPair.buying.issuer || undefined,
            soldAssetCode: assetPair.selling.code,
            soldAssetIssuer: assetPair.selling.issuer || undefined,
            before
        });
    }
}
