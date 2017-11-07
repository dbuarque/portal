export function assetPairsAreDifferent(a, b) {
    if ((a && !b) || (b && !a)) {
        return true;
    }

    if (!a && !b) {
        return false;
    }

    return assetsAreDifferent(a.buying, b.buying) || assetsAreDifferent(a.selling, b.selling);
}

export function assetsAreDifferent(a, b) {
    if ((a && !b) || (b && !a)) {
        return true;
    }

    if (!a && !b) {
        return false;
    }

    return a.code !== b.code || a.issuerId !== b.issuerId;
}
