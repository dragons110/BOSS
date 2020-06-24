/* const { override, fixBabelImports } = require('customize-cra');
module.exports = override(fixBabelImports('import', {libraryName: 'antd-mobile',style: 'css',}),); */


 //create-react-app2.x 版本


const theme = require('./antd-theme');
const { override, fixBabelImports, addLessLoader } = require('customize-cra')

module.exports = override(
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: theme,
    }),
    fixBabelImports('import', {
      libraryName: 'antd-mobile',
      libraryDirectory: 'es',
      style: "css",
    }),
)
//modifyVars: { "@brand-primary": "#1DA57A" }
