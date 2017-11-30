import StellarLedger from 'stellar-ledger-api';

export class LedgerHwService {
    connectLedger(timeout = 5) {
        const Comm = StellarLedger.comm;

        return new Promise((resolve, reject) => {
            new StellarLedger.Api(
                new Comm(timeout)
            )
                .connect(
                    () => {
                        resolve(true);
                    },
                    (err) => {
                        console.warn('Error connecting Ledger');
                        console.warn(err);
                        resolve(false);
                    }
                );
        });
    }

    getPublicKeyFromLedger(bip32Path, timeout = 5) {
        const Comm = StellarLedger.comm;

        return new StellarLedger.Api(
            new Comm(timeout)
        )
            .getPublicKey_async(bip32Path, true, true)
            .then((result) => {
                return result.publicKey;
            })
            .catch((err) => {
                console.error('Error getting public key from Ledger');
                console.error(err);
                return null;
            });
    }
}
