let ntfs = {};
ntfs.template = `<div class="blt-notification">
                            <div class="blt-notification--icon">
                                <i></i>
                            </div>
                            <div class="blt-notification--title">
                                
                            </div>
                            <div class="blt-notification--body">
                        
                            </div>
                        </div>`;
ntfs.pop = function (type, title, content) {

    let _self = this;

    let $title = $('<h3></h3>').text(title || ''),
        $content = $('<p></p>').text(content || '');

    $(_self.template)
        .find('.blt-notification--icon > i').addClass('icon-' + type)
        .find('.blt-notification--title').append($title)
        .find('.blt-notification--body').append($content)
        .appendTo($('body'));

};

module.exports = ntfs;