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
    if (clonedNewState.price) {
        const sellingAmount = clonedNewState.sellingAmount || oldState.sellingAmount;
        if (sellingAmount) {
            clonedNewState.buyingAmount = (new BigNumber(sellingAmount)).times(clonedNewState.price).toString(10);
        }
        else {
            const buyingAmount = newState.buyingAmount || oldState.buyingAmount;
            if (buyingAmount) {
                clonedNewState.sellingAmount = (new BigNumber(buyingAmount)).dividedBy(clonedNewState.price).toString(10);
            }
        }
    }

    else if (clonedNewState.sellingAmount) {
        // Don't both looking for sellingAmount on clonedNewState, we know it doesn't exist there
        if (oldState.price) {
            clonedNewState.buyingAmount = (new BigNumber(clonedNewState.sellingAmount)).times(oldState.price).toString(10);
        }
        else {
            const buyingAmount = clonedNewState.buyingAmount || oldState.buyingAmount;
            if (buyingAmount) {
                clonedNewState.price = (new BigNumber(buyingAmount)).dividedBy(clonedNewState.sellingAmount).toString(10);
            }
        }
    }
    else if (clonedNewState.buyingAmount) {
        // Don't both looking for price on clonedNewState, we know it doesn't exist there
        if (oldState.price) {
            clonedNewState.sellingAmount = (new BigNumber(clonedNewState.buyingAmount)).dividedBy(oldState.price).toString(10);
        }
        // Don't both looking for sellingAmount on clonedNewState, we know it doesn't exist there
        else if (oldState.sellingAmount) {
            clonedNewState.price = (new BigNumber(clonedNewState.buyingAmount)).dividedBy(oldState.sellingAmount).toString(10);
        }
    }
    
    return {
        ...oldState,
        ...clonedNewState
    };
}