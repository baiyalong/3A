/**
 * Created by bai on 2015/8/4.
 */

Template.record.helpers({
    title: '接口日志',
    records: function () {
        return Records.find({}, {limit: Session.get('limit')});
    }
});

Template.record.events({});

Template.record.onCreated(function () {
    Session.setDefault('limit', 20);

    Tracker.autorun(function () {
        Meteor.subscribe('records', Session.get('limit'));
    });
});

Template.record.onRendered(function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            newLimit = Session.get('limit') + 20;
            Session.set('limit', newLimit);
        }
    });
});