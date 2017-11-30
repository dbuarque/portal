import StellarLedger from 'stellar-ledger-api';

export class LedgerHwService {
    connectLedger() {
        const Comm = StellarLedger.comm;

        return new Promise((resolve, reject) => {
            new StellarLedger.Api(
                new Comm(Number.MAX_VALUE)
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

    getPublicKeyFromLedger(bip32Path) {
        const Comm = StellarLedger.comm;

        return new StellarLedger.Api(
            new Comm(5)
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
