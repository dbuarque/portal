/**
 * Created by istrauss on 5/11/2016.
 */

import {inject, Container} from 'aurelia-dependency-injection';
import {ModalService} from 'resources';
import JsonClient from '../clients/json-client';
import BaseResource from './base-resource';

@inject(Container, ModalService)
export default class AssetResource extends BaseResource {
    constructor(container, modalService) {
        super(container, {
            resourceUrl: '/Ticker',
            client: container.get(JsonClient)
        });

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
