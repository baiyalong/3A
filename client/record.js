/**
 * Created by bai on 2015/8/4.
 */

Template.record.helpers({
    title: '�ӿ���־',
    records: function () {
        return Records.find();
    }
});

Template.record.events({});

Template.record.onRendered(function () {
    Meteor.subscribe('records');
});