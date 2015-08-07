/**
 * Created by bai on 2015/8/4.
 */


Meteor.users.attachSchema(new SimpleSchema({
    username: {
        type: String,

    },
    password: {
        type: String,
    },
    roles:{
        type:[String]
    }
}));