const glob = require('glob-all');


describe("Checking generated html files", () => {
    it ('should generate css and js files', (done) => {
        const files = glob.sync([
            './dist/index_*.js',
            './dist/search_*.js',
            './dist/index_*.css',
            './dist/search_*.css'
        ]);
        if (files.length > 0) {
            done();
        } else {
            throw new Error('no css files generated');
        }
    });

   
});