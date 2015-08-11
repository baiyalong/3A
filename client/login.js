/**
 * Created by bai on 2015/8/9.
 */

var login = function () {
    Meteor.loginWithPassword($('#username').val().trim(), $('#password').val().trim(), function (err) {
        if (err)alert(err);
        else {
            $('#modal').closeModal();
            // window.location.pathname = '/user'
            Router.go('/user')
        }
    });
}

Template.login.events({
    'click #login': login,
    'keydown': function (e) {
        if (e.keyCode == 13) {
            login();
        }
    }
});

Template.login.onCreated(function () {
    if (Meteor.user() != null) {
        Router.go('/user');
    }
});

Template.login.onRendered(function () {
    $('#modal').openModal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
        ready: function () {

        }, // Callback for Modal open
        complete: function () {

        } // Callback for Modal close
    });
});