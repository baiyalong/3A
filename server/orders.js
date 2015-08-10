/**
 * Created by bai on 2015/8/4.
 */

Meteor.publish("orders", function () {
    return Orders.find();
});

Orders.allow({
    insert: function () {
        return true
    },
    remove: function () {
        return true
    },
    update: function () {
        return true
    }
})

Meteor.methods({
    newOrder: function (name, products) {
        var id = Roles.createRole(name);
        products.forEach(function (e) {
            Products.update({_id: e}, {$push: {roles: name}});
        });
    },
    deleteOrder: function (name) {
        Roles.deleteRole(name);
        Products.find({roles: {$all: [name]}}).forEach(function (e) {
                Products.update({_id: e._id}, {$pullAll: {roles: [name]}});
            }
        );
    },
    editOrder: function (name, products) {
        Products.find().forEach(function (e) {
                if (e.roles && e.roles.indexOf(name) != -1 && products.indexOf(e._id) == -1) {
                    Products.update({_id: e._id}, {$pullAll: {roles: [name]}});
                }
                else if (e.roles && e.roles.indexOf(name) == -1 && products.indexOf(e._id) != -1) {
                    Products.update({_id: e._id}, {$push: {roles: name}});
                }
            }
        );
    }
});