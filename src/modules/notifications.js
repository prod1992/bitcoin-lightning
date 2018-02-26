(function ($) {

    let ntfs = {};
    ntfs.template = `<div class="blt-notification">
                            <div class="blt-notification--icon">
                                <i></i>
                            </div>
                            <div class="blt-notification--title">
                                
                            </div>
                        </div>`;
    ntfs.pop = function (type, title) {

        let _self = this;

        let _instance = $(_self.template);

        let $title = $('<span class="text-' + type + '"></span>').text(title).appendTo(_instance.find('.blt-notification--title'));

        _instance.find('.blt-notification--icon > i').addClass('icon-' + type);

        _instance.appendTo($('body'))
                            .addClass('appearing');

        setTimeout(function () {
            _instance.hide().remove();
        }, ntfs.timeout);

    };
    ntfs.timeout = 5000;
    module.exports = ntfs;

})(require('jquery'));
