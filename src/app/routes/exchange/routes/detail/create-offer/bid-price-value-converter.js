/**
 * Created by istrauss on 6/4/2017.
 */

export class BidPriceValueConverter {
    toView(price) {
        return this.invert(price);
    }
    fromView(price) {
        return this.invert(price);
    }

    invert(price) {
        return price ? 1 / parseFloat(price, 10) : price;
    }
}
