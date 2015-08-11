/**
 * Created by bai on 2015/8/4.
 */

Template.user.helpers({
    title: '用户管理',
    users: function () {
        return Meteor.users.find();
    },
    Roles: function () {
        return Roles.getAllRoles();
    },
    getRoles: function (roles) {
        if (roles)
            return roles.join();
    }
});

Template.user.events({
    'click #save': function (event, template) {
        var user = {
            username: $('#username').val(),
            password: $('#password').val()
        }
        var roles = Session.get('roles');
        var id = $('#topic').attr('_id');
        if (!id) {
            Meteor.call('newUser', user, roles, function (err, res) {
                if (err)alert(err);
                else
                    Materialize.toast(' 添加成功！', 4000)
            });
        } else {
            user._id = id;
            Meteor.call('editUser', user, roles, function (err, res) {
                if (err)alert(err);
                else
                    Materialize.toast(' 修改成功！', 4000)
            });
        }

    },
    'click .add': function (event, template) {
        $('#topic').text('添加用户');
        $('#topic').attr('_id', null);
        $('#username').val('');
        $('#username').attr('disabled', false);
        $('#password').val('');
        $('input:checkbox').each(function () {
            this.checked = false;
        });
        Session.set('roles', []);
    },
    'click .edit': function () {
        $('#topic').text('修改用户');
        $('#topic').attr('_id', this._id);
        $('#username').val(this.username);
        $('#username').attr('disabled', true);
        $('#password').val('');
        var roles = this.roles;
        if (roles == undefined)roles = []
        Session.set('roles', roles);
        $('input:checkbox[id!="checkAll"]').each(function () {
            if (roles && roles.indexOf(this.name) != -1) {
                this.checked = true;
            }
            else
                this.checked = false;
        });
        $('#modal1').openModal();
    },
    'click .remove': function () {
        Meteor.call('deleteUser', this._id, function (err, res) {
            if (err)alert(err);
            else
                Materialize.toast(' 删除成功！', 4000)
        });
    },
    'change input:checkbox': function () {
        if (this._id === undefined) {
            var ck = $('#checkAll').attr('checked');
            if (ck === undefined)ck = true;
            else ck = !ck;
            $('#checkAll').attr('checked', ck);
            if (ck) {
                $('input:checkbox').each(function () {
                    this.checked = true;
                });
                Session.set('roles', Roles.getAllRoles().fetch().map(function (e) {
                    return e.name;
                }));
            } else {
                $('input:checkbox').each(function () {
                    this.checked = false;
                });
                Session.set('roles', []);
            }
        } else {
            if (this.checked == undefined)
                this.checked = true;
            else
                this.checked = !this.checked;

            var roles = Session.get('roles');
            if (this.checked && roles.indexOf(this.name) == -1)
                roles.push(this.name);
            else {
                var name = this.name;
                roles = roles.filter(function (e) {
                    return e != name
                });
            }
            Session.set('roles', roles);
        }
    }
});

Template.user.onCreated(function(){
    Meteor.subscribe('users');
    Meteor.subscribe('roles');
});

Template.user.onRendered(function () {
    $('select').material_select();
    $('.modal-trigger').leanModal();
});