/**
 * Created by bai on 2015/8/4.
 */

Records.attachSchema(new SimpleSchema({
    userid: {
        type: String,
        label: '�û�ID'
    },
    username: {
        type: String,
        label: "�û���",
    },
    productid: {
        type: String,
        label: '�ӿ�ID'
    },
    addr:{
        type: String,
        label: '�ӿڵ�ַ'
    },
    method:{
        type: String,
        label: '�ӿڷ���'
    },
    req: {
        type: String,
        label: "����"
    },
    resp: {
        type: String,
        label: 'Ӧ��'
    },
    timeStamp: {
        label: 'ʱ���',
        type: Date
    },
    timeInterval: {
        label: 'ʱ����',
        type: Number
    }
}));