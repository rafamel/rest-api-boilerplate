'use strict';
const config = rootRequire('config');

function flowiRequest(toValidate = {}) {
    return async function (req, res, next) {
        try {
            for (let key of ['headers', 'body', 'query', 'params', 'cookies']) {
                if (toValidate.hasOwnProperty(key)) {
                    if (!toValidate[key].isFlowi) {
                        throw Error('Non Flowi object was provided for some key.');
                    }
                    req[key] = await toValidate[key]
                        .attemptAsync(req[key], { strip: true });
                }
            };
            if (!config.production) console.log('Request body:', req['body']);
            return next();
        } catch (err) { return next(err); }
    };
};

class RequestValidation {
    constructor(obj) {
        if (!obj.schema || !obj.schema.isFlowi) {
            throw Error(`RequestValidation requires a Flowi object as key 'schema'`);
        }
        this.schema = obj.schema;

        if (obj.routes) {
            const routes = obj.routes(obj.schema);
            if (routes.hasOwnProperty('schema')) {
                throw Error(`RequestValidation cannot receive a key 'schema' as a route`);
            }

            Object.keys(routes).forEach(key => {
                this[key] = flowiRequest(routes[key]);
            });
        }
    }
}

module.exports = RequestValidation;
