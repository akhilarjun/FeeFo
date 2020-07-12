const msgOBJ = {
    status: '',
    message: '',
    data: null
};

const Message = {
    OK: (msg, obj) => {
        msgOBJ.status = 'SUCCESS';
        msgOBJ.message = msg;
        if (obj) {
            msgOBJ.data = obj
        } else {
            delete msgOBJ.data;
        };
        return msgOBJ;
    },
    FAILURE: (msg, obj) => {
        msgOBJ.status = 'FAILURE';
        msgOBJ.message = msg;
        if (obj) {
            msgOBJ.data = obj
        } else {
            delete msgOBJ.data;
        };
        return msgOBJ;
    }
}

module.exports = Message;