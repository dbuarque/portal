/**
 * Created by istrauss on 5/11/2016.
 */

import {inject, Container} from 'aurelia-dependency-injection';
import {ModalService} from 'global-resources';
import JsonClient from '../clients/json-client';
import BaseResource from './base-resource';

@inject(Container, ModalService)
export default class AssetResource extends BaseResource {
    constructor(container, modalService) {
        super(container, {
            resourceUrl: '/Asset',
            client: container.get(JsonClient)
        });

        this.modalService = modalService;
    }

    codeMatch(match) {
        return this.get('/CodeMatch', {match});
    }

    issuersByCode(code) {
        return this.get('/IssuersByCode', {code});
    }
}
