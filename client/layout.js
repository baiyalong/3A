/**
 * Created by bai on 2015/8/6.
 */

Template.layout.helpers({
    username: function () {
        var user = Meteor.user();
        if (user != null)
            return user.username;
    },
    logout: function () {
        if (Meteor.user()) {
            return '注销';
        }
    }
});
Template.layout.events({
    'click #logout': function () {
        Meteor.logout(function (err) {
            if (err)alert(err);

        });
    }
});
Template.layout.onRendered(function () {

});