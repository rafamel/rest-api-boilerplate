'use strict';
const config = require('../../config');

function flowiRequest(toValidate = {}) {
    return async function (req, res, next) {
        try {
            for (let key of ['headers', 'body', 'query', 'params', 'cookies']) {
                if (toValidate.hasOwnProperty(key)) {
                    if (!toValidate[key].isFlowi) throw Error('Non Flowi object was provided for some key.');
                    req[key] = await toValidate[key].attemptAsync(req[key], { strip: true });
                }
            };
            if (!config.production) console.log('Request body:', req['body']);
            return next();
        } catch (err) { return next(err); }
    };
};

module.exports = flowiRequest;
