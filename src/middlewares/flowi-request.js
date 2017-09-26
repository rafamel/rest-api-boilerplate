'use strict';

function flowiRequest(toValidate = {}) {
    return async function (req, res, next) {
        try {
            for (let key of ['headers', 'body', 'query', 'params', 'cookies']) {
                if (toValidate.hasOwnProperty(key)) {
                    if (!toValidate[key].isFlowi) throw Error('Non Flowi object was provided for some key.');
                    await toValidate[key].assertAsync(req[key]);
                }
            };
            return next();
        } catch (err) { return next(err); }
    };
};

module.exports = flowiRequest;
