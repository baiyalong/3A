/**
 * Created by bai on 2015/8/10.
 */

Meteor.publish("roles", function () {
    return Meteor.roles.find();
});