/**
 * Created by Ishai on 12/7/2016.
 */


const actionTitleMap = {
    login: 'Login',
    authenticate: 'Authenticate'
};

export class LoginRegisterActionTitleValueConverter {
    toView(action) {
        return actionTitleMap[action] || 'Login';
    }
}
