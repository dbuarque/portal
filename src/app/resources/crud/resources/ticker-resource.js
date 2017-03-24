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
     * Gets a list of tickers
     * @param start unix timestamp to start from
     * @param end unix timestamp to end at
     * @returns {*}
     */
    list(start, end) {
        return this.get({start, end}, '/List');
    }
}
