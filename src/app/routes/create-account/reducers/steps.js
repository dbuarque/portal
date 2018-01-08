export function steps(state, action) {
    return [
        {
            routeName: 'introduction'
        },
        {
            routeName: 'choosePublicKeyMethod'
        },
        {
            routeName: 'obtainPublicKey'
        }
    ];
}
