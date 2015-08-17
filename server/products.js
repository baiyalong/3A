/**
 * Created by bai on 2015/8/4.
 */

Products.attachSchema(new SimpleSchema({
    name: {
        type: String,
       // index: true,
       // unique: true
    },
    addr: {
        type: String,
        regEx: SimpleSchema.RegEx.Url
    },
    method: {
        type: String,
    },
    soapMethod: {
        type: String,
        optional: true
    },
    roles: {
        type: [String],
        optional: true
    }
}));

Meteor.publish("products", function () {
    return Products.find();
});

Products.allow({
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
