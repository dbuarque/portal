export function accountsAreDifferent(a, b) {
    if ((a && !b) || (b && !a)) {
        return true;
    }

    if (!a && !b) {
        return false;
    }

    return a.accountId === b.accountId;
}
