/**
 * Created by istrauss on 9/18/2017.
 */

import BigNumber from 'bignumber.js';
import {validStellarNumber} from 'app-resources';

export function isNewAssetPair(oldAssetPair, newAssetPair) {
    return oldAssetPair && newAssetPair &&
        !(
            (oldAssetPair.buying ? oldAssetPair.buying.code : oldAssetPair.buying) ===
            (newAssetPair.buying ? newAssetPair.buying.code : newAssetPair.buying) &&
            (oldAssetPair.buying ? oldAssetPair.buying.issuer : oldAssetPair.buying) ===
            (newAssetPair.buying ? newAssetPair.buying.issuer : newAssetPair.buying) &&
            (oldAssetPair.selling ? oldAssetPair.selling.code : oldAssetPair.selling) ===
            (newAssetPair.selling ? newAssetPair.selling.code : newAssetPair.selling) &&
            (oldAssetPair.selling ? oldAssetPair.selling.issuer : oldAssetPair.selling) ===
            (newAssetPair.selling ? newAssetPair.selling.issuer : newAssetPair.selling)
        );
}

export function calculateNewOrder(newState, oldState = {}) {
    const clonedNewState = Object.keys(newState).reduce((_clone, key) => ({
        ..._clone,
        [key]: key === 'price' ?
            newState[key] :
            validStellarNumber(newState[key])
    }), {});

    if (clonedNewState.price) {
        const sellingAmount = clonedNewState.sellingAmount || oldState.sellingAmount;
        if (sellingAmount) {
            clonedNewState.buyingAmount = validStellarNumber(
                (new BigNumber(sellingAmount)).times(clonedNewState.price[0]).dividedBy(clonedNewState.price[1])
            );
        }
        else {
            const buyingAmount = newState.buyingAmount || oldState.buyingAmount;
            if (buyingAmount) {
                clonedNewState.sellingAmount = validStellarNumber(
                    (new BigNumber(buyingAmount)).times(clonedNewState.price[1]).dividedBy(clonedNewState.price[0])
                );
            }
        }
    }

    else if (clonedNewState.sellingAmount) {
        // Don't bother looking for price in clonedNewState, we know it doesn't exist there
        if (oldState.price) {
            clonedNewState.buyingAmount = validStellarNumber(
                (new BigNumber(clonedNewState.sellingAmount)).times(oldState.price[0]).dividedBy(oldState.price[1])
            );
        }
        else {
            const buyingAmount = clonedNewState.buyingAmount || oldState.buyingAmount;
            if (buyingAmount) {
                clonedNewState.price = (new BigNumber(buyingAmount)).dividedBy(clonedNewState.sellingAmount).toFraction()
            }
        }
    }
    else if (clonedNewState.buyingAmount) {
        // Don't bother looking for price in clonedNewState, we know it doesn't exist there
        if (oldState.price) {
            clonedNewState.sellingAmount = validStellarNumber(
                (new BigNumber(clonedNewState.buyingAmount)).times(oldState.price[1]).dividedBy(oldState.price[0])
            );
        }
        // Don't bother looking for sellingAmount in clonedNewState, we know it doesn't exist there
        else if (oldState.sellingAmount) {
            clonedNewState.price = (new BigNumber(clonedNewState.buyingAmount)).dividedBy(oldState.sellingAmount).toFraction()
        }
    }
    
    return {
        ...oldState,
        ...clonedNewState
    };
}

