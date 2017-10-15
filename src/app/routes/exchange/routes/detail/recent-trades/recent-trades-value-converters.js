import {inject} from 'aurelia-framework';

export class IsABuyValueConverter {
    toView(trade) {
        return trade.operation.sourceAccount === trade.details.seller;
    }
}

@inject(IsABuyValueConverter)
export class IsASellValueConverter {

    constructor(isABuy) {
        this.isABuy = isABuy;
    }

    toView(trade) {
        return !this.isABuy.toView(trade);
    }
}
