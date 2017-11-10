'use strict';
const Delivery = rootRequire('utils/delivery');

function dispatch(cb) {
    return async (req, res, next) => {
        try {
            next(new Delivery(await cb(req)));
        } catch (err) { next(err); }
    };
}

function batchDispatch(obj) {
    Object.keys(obj).forEach(key => {
        const cb = obj[key];
        obj[key] = dispatch(cb);
    });
    return obj;
};

module.exports = {
    dispatch,
    batchDispatch
};
