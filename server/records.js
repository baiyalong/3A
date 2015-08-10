/**
 * Created by bai on 2015/8/4.
 */

Records.attachSchema(new SimpleSchema({
    userid: {
        type: String,
        label: '用户ID'
    },
    username: {
        type: String,
        label: "用户名",
    },
    productid: {
        type: String,
        label: '接口ID'
    },
    name:{
        type: String,
        label: '接口名称'
    },
    addr: {
        type: String,
        label: '接口地址'
    },
    method: {
        type: String,
        label: '接口方法'
    },
    req: {
        type: String,
        label: "请求"
    },
    resp: {
        type: String,
        label: '应答'
    },
    timeStamp: {
        label: '时间戳',
        type: Date
    },
    timeInterval: {
        label: '时间间隔',
        type: Number
    }
}));


Meteor.publish("records", function () {
    return Records.find();
});

Records.allow({
    insert: function () {
        return true
    }
})