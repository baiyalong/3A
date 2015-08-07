/**
 * Created by bai on 2015/8/4.
 */

Template.product.helpers({
    title: '接口管理',
    products: function () {
        return Products.find();
    }
});

Template.product.events({
    'click #save': function (event, template) {
        var product = {
            name: $('#name').val(),
            addr: $('#addr').val(),
            method: $('#method').val() == null ? 'GET' : $('#method').val()
        };
        var id = $('#topic').attr('_id');
        if (!id) {
            Products.insert(product, function (err) {
                if (err)alert(err);
                else
                    Materialize.toast(' 添加成功！', 4000)
            });
        }
        else {
            Products.update({_id: id}, {$set: product}, function (err) {
                if (err)alert(err);
                else
                    Materialize.toast(' 修改成功！', 4000)
            });
        }
    },
    'click .add': function () {
        $('#topic').text('添加接口');
        $('#topic').attr('_id', null);
        $('#name').val('');
        $('#addr').val('');
    },
    'click .remove': function () {
        Products.remove({_id: this._id}, function (err) {
            if (err)alert(err);
            else
                Materialize.toast(' 删除成功！', 4000)
        })
    },
    'click .edit': function () {
        $('#topic').text('修改接口');
        $('#topic').attr('_id', this._id);
        var product = Products.findOne({_id: this._id});
        $('#name').val(product.name);
        $('#addr').val(product.addr);
        $('#method').val(product.method);
        $('#modal1').openModal();
    }
});

Template.product.onRendered(function () {
    $('select').material_select();
    $('.modal-trigger').leanModal();
});