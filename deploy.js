(function () {
    "use strict";

    const shell = require('shelljs');

    let deploy = {};

    deploy.init = function() {
        shell.exec('git reset --hard && git pull origin master', function() {
            shell.exec('gulp && pm2 restart index');
        });
    };

    module.exports = deploy;

})();