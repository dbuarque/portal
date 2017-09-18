/**
 * Created by istrauss on 5/11/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import JsonClient from '../clients/json-client';
import BaseResource from './base-resource';

@inject(JsonClient)
export class EffectResource extends BaseResource {
    constructor() {
        super('/Effect');
    }
}
