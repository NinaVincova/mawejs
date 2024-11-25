module.exports = {
    env: {
        browser: true,
        node: true,       // Recognizes Node.js global variables
        es2021: true,     // Use modern JavaScript syntax
    },
    globals: {
        module: 'readonly', // If you use `module` globally
        require: 'readonly', // If you use `require` globally
        process: 'readonly', // If you use `process` globally
        console: 'readonly', // If you use `console` globally
        __dirname: 'readonly', // If you use `__dirname`
    },
    parserOptions: {
        ecmaVersion: 12, // or higher for modern ECMAScript features
        sourceType: 'module', // for ES Modules
    },
    rules: {
        // Customize rules for unused variables or undefined global usage
        'no-unused-vars': 'off',
        'no-undef': 'off',
    },
};
