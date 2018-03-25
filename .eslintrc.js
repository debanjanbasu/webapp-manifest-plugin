module.exports = {
    parser: "babel-eslint",
    env: {
        browser: false,
        node: true
    },
    extends: "airbnb-base",
    rules: {
        quotes: 0,
        indent: 0,
        "max-len": ["error", { code: 200 }],
        "comma-dangle": 0,
        "no-param-reassign": 0
    }
};
