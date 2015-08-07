/**
 * Created by bai on 2015/8/4.
 */

Products.attachSchema(new SimpleSchema({
    name: {
        type: String,
        index: true,
        unique: true
    },
    addr: {
        type: String,
        regEx: SimpleSchema.RegEx.Url
    },
    method: {
        type: String,
    },
    roles: {
        type: [String],
        optional: true
    }
}));