/**
 * Created by istrauss on 6/2/2017.
 */

import _debounce from 'lodash.debounce';
import _find from 'lodash.find';
import {bindable, inject, Container, computedFrom, bindingMode} from 'aurelia-framework';
import {OfferService} from 'app-resources';
import {CreateOffer} from './create-offer';
import {ExchangeActionCreators} from '../../../exchange-action-creators';

@inject(Container, OfferService, ExchangeActionCreators)
export class CreateBidCustomElement extends CreateOffer {

    @bindable({defaultBindingMode: bindingMode.twoWay}) price;
    
    constructor(container, offerService, exchangeActionCreators) {
        super(container);

        this.offerService = offerService;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    get sellingAsset() {
        return this.assetPair.buying;
    }

    get buyingAsset() {
        return this.assetPair.selling;
    }

    get type() {
        return 'bid';
    }

    get sellingPrice() {
        return this._invertPrice(this.price);
    }

    set sellingPrice(price) {
        this.price = this._invertPrice(price);
    }

    _invertPrice(price) {
        return 1 / parseFloat(price, 10);
    }
}
