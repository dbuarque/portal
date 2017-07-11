/**
 * Created by istrauss on 6/2/2017.
 */

import _find from 'lodash.find';
import {bindable, inject, Container, computedFrom, bindingMode} from 'aurelia-framework';
import {OfferService} from 'app-resources';
import {CreateOffer} from './create-offer';
import {ExchangeActionCreators} from '../../../exchange-action-creators';

@inject(Container, OfferService, ExchangeActionCreators)
export class CreateAskCustomElement extends CreateOffer {

    @bindable({defaultBindingMode: bindingMode.twoWay}) price;
    
    constructor(container, offerService, exchangeActionCreators) {
        super(container);

        this.offerService = offerService;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    get sellingAsset() {
        return this.assetPair.selling;
    }

    get buyingAsset() {
        return this.assetPair.buying;
    }

    get type() {
        return 'ask';
    }

    get sellingPrice() {
        return parseFloat(this.price, 10);
    }

    set sellingPrice(price) {
        this.price = price;
    }
}
