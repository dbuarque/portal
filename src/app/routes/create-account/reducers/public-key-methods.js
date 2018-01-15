export function publicKeyMethods(state, action) {
    return [
        //{
        //    name: 'generateKeystoreFile',
        //    label: 'Generate New Keystore File (Default)',
        //    description: 'Choose this if you dont know what to choose. Use this method to generate keystore file which you can use to access you stellar account.' +
        //    ' A keystore file is a file that stores you stellar account\'s public key and is encrypted with a password of your choice.'
        //},
        {
            name: 'generateRawKeypair',
            label: 'Generate New Key Pair',
            description: 'Use this method to generate a raw key pair. You will be given your secret and public keys. It will be your job to secure them.'
        },
        {
            name: 'providePublicKey',
            label: 'I Already Have An Address',
            description: 'Use this method if you already have a stellar address picked out.'
        },
        {
            name: 'obtainFromLedgerNano',
            label: 'Use My Ledger Nano S',
            description: 'Use this method if you have a ledger nano s and want ot use it to administer your stellar account'
        }
    ];
}
