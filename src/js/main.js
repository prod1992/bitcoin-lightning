(function ($) {


    let $bodyEl = $('body'),
        $loadingOverlay = $('.blt-loading--overlay'),
        $roiLiveEl = $('.blt-roi--values'),
        $roiValueEl = $('.blt-roi--value'),
        $roiPrc = $('#blt-roi--prc'),
        $roiDays = $('#blt-roi--days'),
        $contactForm = $("#contactForm");

    $(window).on('load', function () {

        setTimeout(function () {
            $bodyEl.addClass('loaded');
        }, 0);

    });

    const fetchROI = function (parentElString, callback) {
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

                for (let i = 0; i < roiStrArr.length; i++) {
                    if (roiStrArr[i].indexOf('%') > -1) {
                        percentage = roiStrArr[i];
                        $roiPrc.text(percentage);
                    }
                    if (roiStrArr[i].indexOf('days') > -1) {

                        days = roiStrArr[i - 1];
                        $roiDays.text(days + ' days');
                    }
                }

            },
            error: function (err) {
                console.log(err);

                $roiValueEl.text('?');
                $roiLiveEl.addClass('fetch-error');
            },
            complete: function () {

                setTimeout(function () {
                    $roiLiveEl.removeClass('fetching');
                    $roiLiveEl.removeClass('fetchError');
                }, 500)

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

    $bodyEl
        .on('click', '.navbar-toggler', function (e) {
            if (!$bodyEl.hasClass('blt-nav--open')) {
                $bodyEl.addClass('blt-nav--open');
            } else {
                $bodyEl.removeClass('blt-nav--open');
            }

        })
        .on('click', 'a[href^="#"]', function (e) {
            e.preventDefault();
            let $target = $($(this).attr('href'));

            if ($(e.currentTarget).closest('.mobile-nav').length) {
                $bodyEl.removeClass('blt-nav--open')
            }
            $('html, body').animate({
                scrollTop: $target.offset().top + 1
            }, 500, function (t) {
                return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
            });
        })
        .on('click', '#contactForm button', function (e) {

            e.preventDefault();

            $.ajax({
                type: "POST",
                url: "/contact-request",
                data: $contactForm.serialize(),
                success: function (res) {
                    console.log(res);
                },
                error: function (err) {
                    console.log(err);
                },
            });
        })

})(jQuery);