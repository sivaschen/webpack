const path = require('path');
const webpack = require('webpack');
const Mocha = require('mocha');
const rimraf = require('rimraf');
process.chdir(path.join(__dirname,'template'));

const mocha = new Mocha({
    timeout: '10000ms'
})



rimraf('./dist', () => {
    const prodConfig = require('../../lib/webpack.prod.js');
    webpack(prodConfig, (err, stats) => {
        if (err) {
            console.error(err);
            process.exit(2);
        };
        console.log(stats.toString({
            colors:true,
            modules: false,
            children: false
        }));
        console.log('webpack build success, begin run test')
        mocha.addFile(path.join(__dirname, 'html-test.js'));
        mocha.addFile(path.join(__dirname, 'css-js-test.js'));
        mocha.run();
    })
})