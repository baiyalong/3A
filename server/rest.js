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

Products.find().forEach(function (e) {
    var action = function () {
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
        } catch (err) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.error(err);
        }
        var record = {
            userid: this.userId,
            username: this.user.username,
            productid: e._id,
            name: e.name,
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
    var endPoint = {};
    endPoint[e.method.toLowerCase()] = {
        roleRequired: e.roles,
        action: action
    };
    var path = e.addr.substring(10);
    path = path.substring(path.indexOf('/'));
    api.addRoute(path, {authRequired: true}, endPoint);
})
;