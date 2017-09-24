'use strict';
const validator = require('validator');

module.exports = {
    validator: validator,
    schema: function schema(modelObj) {
        return {
            // Remove all non existant keys in the model
            clean: function clean(input) {
                Object.keys(input)
                    .filter(x => !modelObj.hasOwnProperty(x))
                    .forEach(x => {
                        delete input[x];
                    });
                return input;
            },
            // Test all keys in the model
            all: async function all(input) {
                const modelKeys = Object.keys(modelObj);
                for (let i = 0; i < modelKeys.length; i++) {
                    const modelKey = modelKeys[i];
                    const thisModel = modelObj[modelKey];
                    if (Object.prototype.hasOwnProperty.call(input, modelKey)) {
                        if (thisModel.hasOwnProperty('tests')) {
                            const value = input[modelKey];
                            for (let j = 0; j < thisModel.tests.length; j++) {
                                const { test, message } = thisModel.tests[j];
                                if (!(await test(value, input))) return message;
                            }
                        }
                    } else if (thisModel.hasOwnProperty('required')
                        && thisModel.required[0]) {
                        // Required field
                        return (thisModel.required[1] || 'Required field lacking.');
                    }
                }
                return null;
            }
        };
    }
};
