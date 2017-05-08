/**
 * Created by istrauss on 5/8/2017.
 */

import {inject} from 'aurelia-framework';
import {StellarServer, ModalService} from 'global-resources';
import {SecretStore} from '../../auth/secret-store/secret-store';

@inject(StellarServer, ModalService, SecretStore)
export class PaymentService {

}
