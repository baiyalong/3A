/**
 * Created by bai on 2015/8/3.
 */

var api = new Restivus({
    apiPath: '/',
    onLoggedIn: function () {
        console.log(this.user.username + ' (' + this.userId + ') logged in');
    },
    onLoggedOut: function () {
        console.log(this.user.username + ' (' + this.userId + ') logged out');
    },
    prettyJson: true,
    useDefaultAuth: true
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
Products.find().forEach(function (e) {
    var endPoint = {};
    endPoint[e.method.toLowerCase()] = function () {
        //console.log(this.request);
        // console.log('-------------------------------------------------------------------------------------------')
        var t0 = Date.now();
        var res = false;
        try {
            //console.log(this.bodyParams);
            //console.log('--------');
            var result = HTTP.call(e.method, e.addr, {
                npmRequestOptions: {rejectUnauthorized: false},
                data: this.bodyParams
            });
            res = true;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.error(e);
        }
        var record = {
            userid: this.userId,
            username: this.user.username,
            productid: e._id,
            addr: e.addr,
            method: e.method,
            req: 'req',
            resp: 'resp',
            timeStamp: Date(),
            timeInterval: Date.now() - t0
        };
        Records.insert(record, function (err, res) {
            if (err)console.error(err);
            //  console.log(res);
        });
        // console.log('-------------------------------------------------------------------------------------------')
        // console.log(this.response);
        return {
            statusCode: result.statusCode,
            headers: result.headers,
            body: result.data
        }
    };
    var path = e.addr.substring(10);
    path = path.substring(path.indexOf('/'));
    // api.addRoute(path, {authRequired: true}, endPoint);
})
;