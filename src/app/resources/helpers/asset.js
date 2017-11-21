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

    const aIssuer = a.issuer ? (a.issuer.accountId || a.issuer) : null;
    const bIssuer = b.issuer ? (b.issuer.accountId || b.issuer) : null;

    return a.code !== b.code || aIssuer !== bIssuer;
}
