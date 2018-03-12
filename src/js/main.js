(function ($, Notifications) {
  $.extend($.easing, {
    easeNav: function (t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    },
  })
  
  $(window).on('load', function () {
    
    setTimeout(function () {
      $('body').addClass('loaded')
    }, 1000)
    
  })
  
  let $roiLiveEl = $('.blt-roi--values'),
    $roiValueEl = $('.blt-roi--value'),
    $roiPrc = $('#blt-roi--prc'),
    $roiDays = $('#blt-roi--days'),
    $contactForm = $('#contactForm')
  
  console.log('test', Notifications)
  
  let fetchROI = function (parentElString, callback) {
    let htmlRes,
      percentage,
      days
    
    $roiLiveEl.addClass('fetching')
    
    $.ajax({
      url: '/api',
      success: function (res) {
        console.log('ROI updated', new Date())
        htmlRes = res.replace(/<img[^>]*>/g, '')
        let statsTabSelector = htmlRes.substr(htmlRes.search(parentElString),
          parentElString.length)
        let $statsEl = $(htmlRes).find('#' + statsTabSelector)
        let $roiEl = $statsEl.find('td:contains("ROI")')
        let roiStrArr = $roiEl.next().text().split(' ')
        $roiDays.text('Annual')
        
        for (let i = 0; i < roiStrArr.length; i++) {
          if (roiStrArr[i].indexOf('%') > -1) {
            percentage = roiStrArr[i]
            $roiPrc.text(percentage)
          }
        }
        
      },
      error: function (err) {
        console.log(err)
        
        $roiValueEl.text('?')
        $roiLiveEl.addClass('fetch-error')
      },
      complete: function () {
        $roiLiveEl.removeClass('fetching')
        
      },
    })
    
    if (!!callback) {
      callback()
    }
  }
  
  // fetchROI('TabStats', function () {
  //   setInterval(function () {
  //     fetchROI('TabStats')
  //   }, 30000)
  // })
  
  $('body').on('click', '.navbar-toggler', function (e) {
    if (!$('body').hasClass('blt-nav--open')) {
      $('body').addClass('blt-nav--open')
    } else {
      $('body').removeClass('blt-nav--open')
    }
    
  }).on('click', 'a[href^="#"]', function (e) {
    e.preventDefault()
    let $target = $($(this).attr('href'))
    
    if ($(e.currentTarget).closest('.mobile-nav').length) {
      $('body').removeClass('blt-nav--open')
    }
    $('html, body').animate({
      scrollTop: $target.offset().top + 1,
    }, 700, 'easeNav')
  }).on('click', '#contactForm button', function (e) {
    e.preventDefault()
    let $btn = $(this),
      $btnTxt = $btn.text()
    
    $(this).prop('disabled', true).text('Sending...')
    
    $.ajax({
      type: 'POST',
      url: '/contact-request',
      data: $contactForm.serialize(),
      success: function (res) {
        Notifications.pop('success', 'Message sent!', 5000)
        $contactForm.find('input, textarea').val('')
      },
      error: function (err) {
        Notifications.pop('error', 'Error, please try again!', 5000)
        console.log(err)
      },
      complete: function () {
        $btn.text($btnTxt).prop('disabled', false)
      },
      timeout: 3000,
    })
  })
  
})(require('jquery'), require('../modules/notifications'))

function antilopText ($element) {
  var $heroTxt = $element.text(),
    charArr = $heroTxt.split(''),
    $newHtml = ''
  
  $.each(charArr, function (i, char) {
    
    if (char !== ' ') {
      $newHtml += '<span style="display: inline-block;transition: 0.2s all;-webkit-transition: 0.2s all;vertical-align: middle;">' +
        char + '</span>'
    }
    else {
      $newHtml += '<span style="display:inline-block;vertical-align:middle;transition: 0.2s all;-webkit-transition: 0.2s all;">&nbsp;</span>'
    }
    
  })
  
  $element.html($newHtml)
  
  $element.find('> span').each(function (i, ch) {
    let $chEl = $(ch),
      $chTxt = $chEl.text(),
      $chIsEmpty = !$chTxt
    if (!$chIsEmpty) {
      $(window).on('scroll', function () {
        var wScrolled = $(window).scrollTop(),
          mtpl = (Math.random() * 2 - 1) / 5
        $chEl.css({
          'transform': 'translate(0, ' + (mtpl * wScrolled) + 'px)',
          '-webkit-transform': 'translate(0, ' + (mtpl * wScrolled) + 'px)',
          'opacity': 1 - (wScrolled / 200),
        })
      })
    }
  })
}