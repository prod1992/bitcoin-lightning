(function ($, Notifications) {

    $(window).on('load', function () {

        setTimeout(function () {
            $('body').addClass('loaded');
        }, 0);

    });

    let $roiLiveEl = $('.blt-roi--values'),
        $roiValueEl = $('.blt-roi--value'),
        $roiPrc = $('#blt-roi--prc'),
        $roiDays = $('#blt-roi--days'),
        $contactForm = $("#contactForm");

    console.log('test', Notifications);

    let fetchROI = function (parentElString, callback) {
        let htmlRes,
            percentage,
            days;

        $roiLiveEl.addClass('fetching');

        $.ajax({
            url: '/api',
            success: function (res) {

                htmlRes = res.replace(/<img[^>]*>/g, "");
                let statsTabSelector = htmlRes.substr(htmlRes.search(parentElString), parentElString.length);
                let $statsEl = $(htmlRes).find('#' + statsTabSelector);
                let $roiEl = $statsEl.find('td:contains("ROI")');
                let roiStrArr = $roiEl.next().text().split(' ');
                $roiDays.text('Annual');

                for (let i = 0; i < roiStrArr.length; i++) {
                    if (roiStrArr[i].indexOf('%') > -1) {
                        percentage = roiStrArr[i];
                        $roiPrc.text(percentage);
                    }
                }

            },
            error: function (err) {
                console.log(err);

                $roiValueEl.text('?');
                $roiLiveEl.addClass('fetch-error');
            },
            complete: function () {
                $roiLiveEl.removeClass('fetching');

            }
        });

        if (!!callback) {
            callback();
        }
    };

    fetchROI('TabStats', function () {
        setInterval(function () {
            fetchROI('TabStats');
        }, 10000);
    });

    $('body')
        .on('click', '.navbar-toggler', function (e) {
            if (!$('body').hasClass('blt-nav--open')) {
                $('body').addClass('blt-nav--open');
            } else {
                $('body').removeClass('blt-nav--open');
            }

        })
        .on('click', 'a[href^="#"]', function (e) {
            e.preventDefault();
            let $target = $($(this).attr('href'));

            if ($(e.currentTarget).closest('.mobile-nav').length) {
                $('body').removeClass('blt-nav--open')
            }
            $('html, body').animate({
                scrollTop: $target.offset().top + 1
            }, 500, function (t) {
                return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
            });
        })
        .on('click', '#contactForm button', function (e) {
            e.preventDefault();
            let $btn = $(this),
                $btnTxt = $btn.text();

            $(this).prop('disabled', true).text('Sending...');

            $.ajax({
                type: "POST",
                url: "/contact-request",
                data: $contactForm.serialize(),
                success: function (res) {
                    Notifications.pop('success', 'Message sent!', 5000);
                    console.log(res);
                },
                error: function (err) {
                    Notifications.pop('error', 'Error, please try again!', 5000);
                    console.log(err);
                },
                complete: function () {
                    $btn.text($btnTxt).prop('disabled', false);
                }
            });
        })

})(require('jquery'), require('../modules/notifications'));

