/**
 * Created by bai on 2015/8/3.
 */

var restivus = function () {

    restivusApi = new Restivus({
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

    var productRestivus = [];
    Products.find().fetch().forEach(function (e) {
        if (productRestivus.some(function (ee) {
                return ee.addr == e.addr
            })) {
            var p = productRestivus.filter(function (eee) {
                return eee.addr == e.addr
            })[0];
            if (e.soapMethod != undefined && e.soapMethod != null && e.soapMethod != '') {
                p.soapMethodR.push(e.soapMethod);
                var roles = e.roles;
                if (roles == undefined)roles = [];
                p.rolesR.push(roles);
            }
        } else {
            e.soapMethodR = [];
            e.rolesR = [];
            if (e.soapMethod != undefined && e.soapMethod != null && e.soapMethod != '') {
                e.soapMethodR.push(e.soapMethod);
                var roles = e.roles;
                if (roles == undefined)roles = [];
                e.rolesR.push(roles);
            }
            productRestivus.push(e);
        }
    })


    if (productRestivus.length == 0)return;
    productRestivus.forEach(function (e) {
        var roles = e.rolesR.reduce(function (p, c) {
            return p.concat(c)
        }, [])
        roles.forEach(function (ee) {
            if (e.roles.indexOf(ee) == -1) {
                e.roles.push(ee);
            }
        })
    })

    productRestivus.forEach(function (e) {
        restivusApi.addRoute((function (e) {
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

                        //1.1,soap authentication
                        var userId = this.userId;
                        var soapAuth = true;
                        if (e.soapMethodR.length != 0) {
                            e.soapMethodR.forEach(function (s, i) {
                                if (req.body.indexOf(s) != -1) {
                                    if (!Roles.userIsInRole(userId, e.rolesR[i])) {
                                        soapAuth = false;
                                    }
                                }
                            })
                        }
                        if (!soapAuth) {
                            return {
                                statusCode: 401,
                                headers: {
                                    'content-type': 'application/json'
                                },
                                body: {
                                    code: 'Unauthorized'
                                }
                            }
                        }


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
            })
            (e)
        )
        ;
    })
    ;

}

restivus();

Meteor.methods({
    refreshRestivus: function () {
        restivus();
    }
});