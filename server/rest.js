/**
 * Created by bai on 2015/8/3.
 */

var api = new Restivus({
    apiPath: 'api/',
    onLoggedIn: function () {
        console.log(this.user.username + ' (' + this.userId + ') logged in');
    },
    onLoggedOut: function () {
        console.log(this.user.username + ' (' + this.userId + ') logged out');
    },
    prettyJson: true,
    useDefaultAuth: true
//DEFAULTOPTIONSENDPOINT
});

api.addRoute('test/:id', {authRequired: true}, {
    get: {
        roleRequired: ['author', 'admin'],
        action: function () {
            return {status: 'success', data: {message: 'ok'}};
        }
    }
});