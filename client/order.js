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
        var id = $('#topic').attr('_id');
        if (name == '') {
            alert('角色名不能为空！');
            return;
        }
        if (!id && Roles.getAllRoles().fetch().some(function (e) {
                return e.name == name;
            })) {
            alert('角色名重复！');
            return;
        }
        var products = Session.get('products');

        if (!id) {
            Meteor.call('newOrder', name, products, function (err) {
                if (err)alert(err)
                else
                    Materialize.toast(' 添加成功！', 4000)
            });
        } else {
            if (Session.get('product') == name)
                Meteor.call('editOrder', name, products, function (err) {
                    if (err)alert(err)
                    else
                        Materialize.toast(' 修改成功！', 4000)
                });
            else
                Meteor.call('deleteOrder', Session.get('product'), function (err) {
                    if (err)alert(err)
                    else {
                        Meteor.call('newOrder', name, products, function (err) {
                            if (err)alert(err)
                            else
                                Materialize.toast(' 修改成功！', 4000)
                        });
                    }
                });
        }
    },
    'click .add': function () {
        $('#topic').text('添加角色');
        $('#topic').attr('_id', null);
        $('#name').val(null);
        $('input:checkbox').each(function () {
            this.checked = false;
        });
        Session.set('products', []);
    },
    'click .edit': function () {
        $('#topic').text('修改角色');
        $('#topic').attr('_id', this._id);
        $('#name').val(this.name);
        var products = Products.find({roles: this.name}).fetch().map(function (e) {
            return e._id;
        });
        Session.set('products', products);
        Session.set('product', this.name);
        $('input:checkbox[id!="checkAll"]').each(function () {
            if (products && products.indexOf(this.id) != -1) {
                this.checked = true;
            }
            else
                this.checked = false;
        });
        $('#modal1').openModal();
    },
    'click .remove': function () {
        Meteor.call('deleteOrder', this.name, function (err) {
            if (err)alert(err)
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
                Session.set('products', Products.find().fetch().map(function (e) {
                    return e._id;
                }));
            } else {
                $('input:checkbox').each(function () {
                    this.checked = false;
                });
                Session.set('products', []);
            }
        } else {
            if (this.checked == undefined)
                this.checked = true;
            else
                this.checked = !this.checked;

            var products = Session.get('products');
            if (this.checked && products.indexOf(this._id) == -1)
                products.push(this._id);
            else {
                var id = this._id;
                products = products.filter(function (e) {
                    return e != id
                });
            }
            Session.set('products', products);
        }
    }
});

Template.order.onRendered(function () {
    $('.modal-trigger').leanModal();
    Meteor.subscribe('orders');
    Meteor.subscribe('users');
    Meteor.subscribe('products');
    Meteor.subscribe('roles');
});