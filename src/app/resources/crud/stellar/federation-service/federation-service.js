/**
 * Created by istrauss on 6/19/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {ModalService} from 'global-resources';

@inject(ModalService)
export class FederationService {

    constructor(modalService) {
        this.modalService = modalService;
    }

    collect() {
        return this.modalService.open(
            PLATFORM.moduleName('app/resources/crud/stellar/federation-service/collect-federated-address-modal/collect-federated-address-modal')
        );
    }
}