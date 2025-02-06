const pluginJs = require("@eslint/js") ;

module.exports = [
    pluginJs.configs.recommended,
    
   {
       rules: {
           "no-unused-vars": "warn",
           "no-undef": "warn"
       }
       ,
       env: {
        node: true,
        jest: true
      },
      extends: [
        'airbnb-base', 
        'plugin:jest/recommended', 
        'plugin:security/recommended', 
        'plugin:prettier/recommended'
      ],
      plugins: ['jest', 'security', 'prettier'],
      parserOptions: {
        ecmaVersion: 2018
      },
   }
];