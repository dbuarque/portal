/**
 * Created by istrauss on 9/16/2017.
 */

import {inject} from 'aurelia-framework';
import {AlertToaster} from 'global-resources';
import {userFriendlyEffectMessage} from 'app-resources';
import {AccountStream} from './account-stream';

@inject(AlertToaster, AccountStream)
export class AccountEffectAlerter {
    constructor(alertToaster, accountStream) {
        this.alertToaster = alertToaster;
        this.accountStream = accountStream;
    }

    init() {
        this.accountStream.subscribe(this._handleAccountEffects.bind(this));
    }

    _handleAccountEffects(msg) {
        if (msg.type !== 'effects') {
            return;
        }

        const alerts = this._alertsFromEffects(msg.payload);

        alerts.forEach(a => {
            this.alertToaster[a.type](a.msg);
        });
    }

    _alertsFromEffects(effects) {
        return effects
            .map(e => {
                const msg = userFriendlyEffectMessage(e);

                return msg ?
                    {
                        msg,
                        type: this._alertType(e)
                    } :
                    null;
            })
            .filter(alert => !!alert);
    }

    _alertType(e) {
        switch (e.type) {
            default:
                return 'success';
        }
    }
}
