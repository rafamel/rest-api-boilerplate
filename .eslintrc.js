module.exports = {
    "extends": "standard",
    "rules": {
        // Indentation
        "indent": [ 2, 4 ],
        // Semicolons
        "semi": [2, "always"],
        // Space before function parenthesis
        "space-before-function-paren": [2, {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "always"
        }],
        // Template strings inner spacing
        "template-curly-spacing": 0,
        "operator-linebreak": [2, "before"]
    }
};
