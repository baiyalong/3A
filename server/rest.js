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
        //roleRequired: ['author', 'admin'],
        action: function () {

            //this.unblock();
            var res = false;
            try {
                var result = HTTP.call("GET", "https://10.192.18.170/#/login", {
                    npmRequestOptions: {rejectUnauthorized: false}
                });
                res = true;
            } catch (e) {
                // Got a network error, time-out or HTTP error in the 400 or 500 range.
                console.log(e);
            }

            return {status: res, data: {message: result}};
        }
    }
});