(function () {
    "use strict";

    const shx = require('shelljs');

    let deploy = {};

    deploy.init = function() {
        shx.exec('git reset --hard && git pull origin master', function() {
            shx.exec('gulp && pm2 restart index');
        });
    };

    module.exports = deploy;

})();