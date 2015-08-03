/**
 * Created by bai on 2015/8/3.
 */

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
});

Router.route('/', {name: 'login'});
Router.route('/user');
Router.route('/product');
Router.route('/order');
Router.route('/record');
