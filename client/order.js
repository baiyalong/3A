/**
 * Created by bai on 2015/8/4.
 */


Template.order.helpers({
    title: '权限管理',
    users: function () {
        return Meteor.users.find();
    },
    products: function () {
        return Products.find();
    },
    roles: function () {
        return Roles.getAllRoles();
    },
    getProducts: function (name) {
        return Products.find({roles: name}).fetch().map(function (e) {
            return e.name;
        }).toString();
    }
})
;

Template.order.events({
    'click #save': function (event, template) {
        var name = $('#name').val().trim();
        if (name == '') {
            alert('角色名不能为空！');
            return;
        }
        if (Roles.getAllRoles().fetch().some(function (e) {
                return e.name == name;
            })) {
            alert('角色名重复！');
            return;
        }
        var checked = $('input:checkbox[checked="checked"][id!="checkAll"]');
        if (checked.lang == 0) {
            alert('请勾选接口！');
            return;
        }
        var id = $('#topic').attr('_id');
        if (!id) {
            try {
                var id = Roles.createRole(name);
                checked.each(function () {
                    Products.update({_id: $(this).attr('id')}, {
                        $push: {roles: name}
                    }, function (err) {
                        if (err)alert(err);
                    });
                });
                Materialize.toast(' 添加成功！', 4000)
            } catch (err) {
                alert(err);
            }
        } else {

        }
    },
    'click .add': function () {
        $('#topic').text('添加角色');
        $('#topic').attr('_id', null);
        $('#name').val(null);
        $('input:checkbox').each(function () {
            $(this).attr('checked', false);
        });
    },
    'click .edit': function () {
        $('#topic').text('修改角色');
        $('#topic').attr('_id', this._id);
        $('#name').val(this.name);

        $('#modal1').openModal();
    },
    'click .remove': function () {
        try {
            Roles.deleteRole(this.name);
            Materialize.toast(' 删除成功！', 4000)
        } catch (err) {
            alert(err);
        }
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

Template.order.onRendered(function () {
    $('.modal-trigger').leanModal();
});