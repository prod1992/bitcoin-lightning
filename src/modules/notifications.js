(function ($) {

    let ntfs = {};
    ntfs.template = `<div class="blt-notification">
                            <div class="blt-notification--icon">
                                <i></i>
                            </div>
                            <div class="blt-notification--title">
                                
                            </div>
                        </div>`;
    ntfs.pop = function (type, title, duration) {

        let _self = this;

        duration = duration ? duration : ntfs.defaults.duration;

        let _instance = $(_self.template);

        _instance.on('click', ntfs.onClick);

        let $title = $('<span class="text-' + type + '"></span>')
            .text(title)
            .appendTo(_instance.find('.blt-notification--title'));

        _instance.find('.blt-notification--icon > i').addClass('icon-' + type);

        _instance
            .appendTo($('body'))
            .css({
                '-webkit-animation-duration' : duration / 1000 + 's',
                'animation-duration' : duration / 1000 + 's',
            })
            .addClass('appearing');

        setTimeout(function () {
            _instance.hide().remove();
        }, duration);

    };
    ntfs.onClick = function (instance) {
        instance.fadeOut(function () {
            instance.hide();
        });
    };
    ntfs.defaults = {
        duration: 5000,
    };
    module.exports = ntfs;

})(require('jquery'));
