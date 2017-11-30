import {actionCreator} from 'au-redux';
import {UPDATE_BIP_32_PATH} from '../app.action-types';

@actionCreator()
export class UpdateBip32PathActionCreator {
    constructor(assetResource) {
        this.assetResource = assetResource;
    }

    initFromStore() {
        const bip32Path = localStorage.getItem('bip_32_path') || "44'/148'/0'";

        if (bip32Path) {
            this.dispatch(
                bip32Path
            );
        }
    }

    create(bip32Path = null) {
        localStorage.setItem('bip_32_path', bip32Path);

        return {
            type: UPDATE_BIP_32_PATH,
            payload: bip32Path
        };
    }
}
