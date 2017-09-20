/**
 * Created by istrauss on 6/30/2017.
 */

import {inject} from 'aurelia-framework';
import {StellarServer} from './stellar-server';
import {AlertToaster} from '../workers/toasters';
import {StellarStream} from './stellar-stream';

@inject(StellarServer, AlertToaster)
export class StellarStreamProvider {

    constructor(stellarServer, alertToaster) {
        this.stellarServer = stellarServer;
        this.alertToaster = alertToaster;
    }

    get(type, options = {}) {
        if (!this.server[this.type]) {
            throw new Error('Invalid type provided to StellarStreamFactory.');
        }

        this[type] = this[type] || new StellarStream(this.stellarServer, this.alertToaster, type, options);

        return this[type];
    }
}