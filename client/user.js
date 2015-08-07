/**
 * Created by bai on 2015/8/4.
 */

Template.user.helpers({
    title: '用户管理',
    users: function () {
        var users = Meteor.users.find();

        return users;
    },
    roles: function () {
        return Roles.getAllRoles();
    }
});

Template.user.events({
    'click #save': function (event, template) {
        var user = {
            username: $('#username').val(),
            password: $('#password').val()
        }
        Accounts.createUser(user, function (err, res) {
                if (err)alert(err);
                else
                    Materialize.toast(' 添加成功！', 4000)
            }
        );
    },
    'click .add': function (event, template) {
        $('#topic').text('添加用户');
        $('#topic').attr('_id', null);
        $('#username').val('');
        $('#password').val('');
        $('input:checkbox').each(function () {
            $(this).attr('checked', false);
        });
    },
    'click .edit': function () {
        $('#topic').text('修改用户');
        $('#topic').attr('_id', this._id);
        $('#username').val(this.username);
        $('#password').val('');
        $('input:checkbox').each(function () {
            $(this).attr('checked', false);
        });
        $('#modal1').openModal();
    },
    'click .remove': function () {
        Meteor.users.remove({_id: this._id}, function (err) {
            if (err)alert(err);
            else
                Materialize.toast(' 删除成功！', 4000)
        })
    },
    'change input:checkbox': function () {
        if (this._id === undefined) {
            var ck = $('#checkAll').attr('checked');
            if (ck === undefined)ck = false;
            if (!ck) {
                $('input:checkbox').each(function () {
                    $(this).attr('checked', true);
                });
            } else {
                $('input:checkbox').each(function () {
                    $(this).attr('checked', false);
                });
            }
        } else {
        }
    }
});

Template.user.onRendered(function () {
    $('select').material_select();
    $('.modal-trigger').leanModal();
});