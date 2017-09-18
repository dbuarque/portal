/**
 * Created by istrauss on 9/18/2017.
 */

import BigNumber from 'bignumber.js';

export function isNewAssetPair(oldAssetPair, newAssetPair) {
    return oldAssetPair && newAssetPair &&
        !(
            oldAssetPair.buying.code === newAssetPair.buying.code &&
            oldAssetPair.buying.issuer === newAssetPair.buying.issuer &&
            oldAssetPair.selling.code === newAssetPair.selling.code &&
            oldAssetPair.selling.issuer === newAssetPair.selling.issuer
        );
}

export function calculateNewOrder(newState, oldState) {
    const clonedNewState = {
        ...newState
    };
    
    if (clonedNewState.sellingAmount) {
        const price = clonedNewState.price || oldState.price;
        if (price) {
            clonedNewState.buyingAmount = (new BigNumber(clonedNewState.sellingAmount)).times(price).toString(10);
        }
        else {
            const buyingAmount = clonedNewState.buyingAmount || oldState.buyingAmount;
            if (buyingAmount) {
                clonedNewState.price = (new BigNumber(buyingAmount)).dividedBy(clonedNewState.sellingAmount).toString(10);
            }
        }
    }
    else if (clonedNewState.price) {
        const buyingAmount = newState.buyingAmount || oldState.buyingAmount;
        if (buyingAmount) {
            clonedNewState.sellingAmount = (new BigNumber(buyingAmount)).dividedBy(clonedNewState.price).toString(10);
        }
    }
    
    return {
        ...oldState,
        ...clonedNewState
    };
}