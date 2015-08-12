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
    api.addRoute((function (e) {
        var path = e.addr.substring(10);
        path = path.substring(path.indexOf('/') + 1);
        return path;
    })(e), {authRequired: true}, (function (e) {
        var endPoint = {};
        endPoint[e.method.toLowerCase()] = {
            roleRequired: e.roles,
            action: function () {
                var t0 = Date.now();

                //1,get req message
                var req = (function (req) {
                    var body = '';
                    body = (Meteor.wrapAsync(function (req, callback) {
                        req.on('readable', function () {
                            body += req.read();
                            callback && callback(null, body);
                        });
                    }))(req);
                    (Meteor.wrapAsync(function (req, callback) {
                        req.on('end', function () {
                            callback && callback(null);
                        });
                    }))(req);
                    return {
                        method: req.method,
                        url: req.url,
                        headers: req.headers,
                        body: body
                    }
                })(this.request);

                //2,make call
                var resp = (function (e, req) {
                    var res = {};
                    try {
                        res = HTTP.call(e.method, e.addr, {
                            npmRequestOptions: {rejectUnauthorized: false},
                            headers: req.headers,
                            content: req.body
                        });
                    } catch (err) {
                        console.error(err);
                    }
                    return res;
                })(e, req);

                //3,record
                Records.insert({
                    userid: this.userId,
                    username: this.user.username,
                    productid: e._id,
                    name: e.name,
                    addr: e.addr,
                    method: e.method,
                    req: JSON.stringify(req),
                    resp: JSON.stringify(resp),
                    timeStamp: Date(),
                    timeInterval: Date.now() - t0
                });

                //4,return resp
                return {
                    statusCode: resp.statusCode,
                    headers: resp.headers,
                    body: resp.content
                };
            }
        }
        return endPoint;
    })(e));
});