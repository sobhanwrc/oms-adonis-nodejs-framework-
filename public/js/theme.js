// -----------------------------

//   js index
/* =================== */
/*




*/
// -----------------------------


(function ($) {
    "use strict";

    /*---------------------
    handler
    --------------------- */
    $(window).on('load', function () {
        bpMenuareaFixed();
        bpMenuareaFixed2();
        bpMenuareaFixed3();
        bpCounterUphendle();
        bpSmoothhendle();
    });

    $(window).on ('load', function (){ // makes sure the whole site is loaded
        $('#loader').fadeOut(); // will first fade out the loading animation
        $('#loader-wrapper').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
        $('body').delay(350).css({'overflow':'visible'});
    })


    /*----------------------------
    slick nav
    ------------------------------ */
    $('.menu').slicknav({
        prependTo: '.responsive-menu',
        label: '',
        allowParentLinks: true
    });

    /*------------------------
    meanmenu-remove-class
    ------------------------*/
    $(window).on('resize', function () {
        var wWidth = $(this).width();

        if (wWidth < 991) {
            // removing class
            $('.drop').addClass('m-d-removed');
            $('.m-d-removed').removeClass('drop');

            $('.third').addClass('t-h-m-removed');
            $('.t-h-m-removed').removeClass('third');

            $('.mega-menu').addClass('m-g-removed');
            $('.m-g-removed').removeClass('mega-menu');
        } else {
            // adding class
            $('.m-d-removed').addClass('drop');
            $('.drop').removeClass('m-d-removed');

            $('.third').removeClass('t-h-m-removed');
            $('.t-h-m-removed').addClass('third');

            $('.mega-menu').removeClass('m-g-removed');
            $('.m-g-removed').addClass('mega-menu');
        }
    }).resize();

    /*-----------------
    header1 sticky
    -----------------*/
    function bpMenuareaFixed() {
        if ($('.h1-header-bottom-area').length) {
            $(window).on('scroll', function () {
                if ($(window).scrollTop() > 160) {
                    $('.h1-header-bottom-area').addClass('navbar-fixed-top');
                } else {
                    $('.h1-header-bottom-area').removeClass('navbar-fixed-top');
                }
            });
        }
    }

    /*-----------------
    header2 sticky
    -----------------*/
    function bpMenuareaFixed2() {
        if ($('.h2-header-bottom-area').length) {
            $(window).on('scroll', function () {
                if ($(window).scrollTop() > 200) {
                    $('.h2-header-bottom-area').addClass('navbar-fixed-top');
                } else {
                    $('.h2-header-bottom-area').removeClass('navbar-fixed-top');
                }
            });
        }
    }

    /*-----------------
    header3 sticky
    -----------------*/
    function bpMenuareaFixed3() {
        if ($('.header-3').length) {
            $(window).on('scroll', function () {
                if ($(window).scrollTop() > 140) {
                    $('.header-3').addClass('navbar-fixed-top');
                } else {
                    $('.header-3').removeClass('navbar-fixed-top');
                }
            });
        }
    }

    /*-----------------
    scroll-up
    -----------------*/
    $.scrollUp({
        scrollText: '<i class="fa fa-arrow-up" aria-hidden="true"></i>',
        easingType: 'linear',
        scrollSpeed: 500,
        animation: 'fade'
    });

    /*-----------------
    wow active
    -----------------*/
    new WOW().init();

    /*------------------------------
         counter
    ------------------------------ */
    function bpCounterUphendle() {
        $('.counter-up').counterUp();
    };

    /*-------------------------------------
    add remove active pricing button
    ------------------------------------ */
    $(function () {
        var $pl_btns = $('.pl-btn').on('click', function () {
            $pl_btns.removeClass('active');
            $(this).addClass('active');
        });
    });

    /*-------------------------------------
    add remove active pricing table
    ------------------------------------ */
    $('#pn_1').on('click', function () {
        // changing on pricing content
        $('.single-pricing').removeClass('active');
        $('.prt_1').addClass('active');
    });

    $('#pn_2').on('click', function () {
        // changing on pricing content
        $('.single-pricing').removeClass('active');
        $('.prt_2').addClass('active');
    });

    /*-------------------------------------
    element animation
    ------------------------------------ */
    if ($('div').hasClass('portfolio-area')) {
        var distance = $('.portfolio-area').offset().top;

        $(window).on('scroll', function () {
            var top_distance = $(window).scrollTop() + -600;
            if (top_distance >= distance) {
                $('.portfolio-area .portfolio-banner-1').css('left', '20px');
                $('.portfolio-area .portfolio-banner-2').css('right', '-10%');
            } else {
                $('.portfolio-area .portfolio-banner-1').css('left', '-20%');
                $('.portfolio-area .portfolio-banner-2').css('right', '-20%');
            }
        });
    }

    // h2-who
    if ($('div').hasClass('h2-who-we-area')) {
        var distance = $('.h2-who-we-area').offset().top;

        $(window).on('scroll', function () {
            var top_distance = $(window).scrollTop() + -200;
            if (top_distance >= distance) {
                $('.h2-who-we-area .h2-who-we-banner').css('left', '-21%');
            } else {
                $('.h2-who-we-area .h2-who-we-banner').css('left', '-41%');
            }
        });
    }


    /*---------------------
    smooth scroll
    --------------------- */
    function bpSmoothhendle() {
        $('.smoothscroll').on('click', function (e) {
            e.preventDefault();
            var target = this.hash;

            $('html, body').stop().animate({
                'scrollTop': $(target).offset().top - 80
            }, 1200);
        });
    }


    /*---------------------
    countdown
    --------------------- */
    $('[data-countdown]').each(function () {
        var $this = $(this),
            finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function (event) {
            $this.html(event.strftime('<span class="cdown days"><span class="time-count">%-D</span> <p>Days</p></span> <span class="cdown hour"><span class="time-count">%-H</span> <p>Hour</p></span> <span class="cdown minutes"><span class="time-count">%M</span> <p>Min</p></span> <span class="cdown second"> <span><span class="time-count">%S</span> <p>Sec</p></span>'));
        });
    });

    /*---------------------
    video-popup
    --------------------- */
    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 300,
        preloader: false,
        fixedContentPos: false
    });

    /*---------------------
    project-isotope
    --------------------- */
    $('#container').imagesLoaded(function () { //image loaded

        // filter items on button click
        $('.project-menu').on('click', 'button', function () {
            var filterValue = $(this).attr('data-filter');
            $grid.isotope({
                filter: filterValue
            });
            $('.project-menu').find('.checked').removeClass('checked');
            $(this).addClass('checked');
        });

        // masonary activation
        var $grid = $('.grid_container').isotope({
            itemSelector: '.grid',
            percentPosition: true,
            masonry: {
                // use outer width of grid-sizer for columnWidth
                columnWidth: '.grid'
            }
        })
		$(".project-menu button.checked").click();
    });

    /*---------------------
    slider-carousel
    --------------------- */
    function slider_carousel() {
        var owl = $(".slider-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 20,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            nav: false,
            items: 1,
            smartSpeed: 300,
            dots: true,
            autoplay: true,
            autoplayTimeout: 4000,
            center: true,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                760: {
                    items: 1
                }
            }
        });
    }
    slider_carousel();


    /*---------------------
    testimonial-carousel
    --------------------- */
    function testimonial_carousel() {
        var owl = $(".testimonial-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 20,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            nav: true,
            items: 1,
            smartSpeed: 300,
            dots: false,
            autoplay: false,
            autoplayTimeout: 4000,
            center: true,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                760: {
                    items: 1
                }
            }
        });
    }
    testimonial_carousel();

    /*---------------------
    brand-carousel
    --------------------- */
    function brand_carousel() {
        var owl = $(".brand-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 30,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            nav: false,
            items: 5,
            smartSpeed: 300,
            dots: false,
            autoplay: true,
            autoplayTimeout: 4000,
            center: true,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 2
                },
                760: {
                    items: 4
                },
                992: {
                    items: 5
                }
            }
        });
    }
    brand_carousel();

    /*---------------------
    h2-slider-area
    --------------------- */
    function h2_slider_area() {
        var owl = $(".h2-slider-area");
        owl.owlCarousel({
            loop: true,
            margin: 0,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='flaticon-left-arrow'></i>", "<i class='flaticon-arrow-pointing-to-right'></i>"],
            nav: true,
            items: 1,
            smartSpeed: 300,
            dots: true,
            autoplay: true,
            autoplayTimeout: 4000000,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut',
            center: true,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                760: {
                    items: 1
                }
            }
        });
    }
    h2_slider_area();

    /*---------------------
    h2-testimonial-carousel
    --------------------- */
    function h2_testimonial_carousel() {
        var owl = $(".h2-testimonial-carousel");
        owl.owlCarousel({
            loop: true,
            margin: 30,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='flaticon-left-arrow'></i>", "<i class='flaticon-arrow-pointing-to-right'></i>"],
            nav: true,
            items: 3,
            smartSpeed: 300,
            dots: false,
            autoplay: true,
            autoplayTimeout: 4000,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut',
            center: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                760: {
                    items: 2
                },
                992: {
                    items: 3
                }
            }
        });
    }
    h2_testimonial_carousel();


    /*---------------------
    h3-slider-area
    --------------------- */
    function h3_slider_area() {
        var owl = $(".h3-slider-area");
        owl.owlCarousel({
            loop: true,
            margin: 0,
            responsiveClass: true,
            navigation: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            nav: false,
            items: 1,
            smartSpeed: 300,
            dots: true,
            autoplay: true,
            autoplayTimeout: 4000,
            center: true,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                760: {
                    items: 1
                }
            }
        });
    }
    h3_slider_area();


    /*---------------------
    // Ajax Contact Form
    --------------------- */

    $('.cf-msg').hide();
    $('form#cf button#submit').on('click', function () {
        var fname = $('#fname').val();
        var subject = $('#subject').val();
        var email = $('#email').val();
        var msg = $('#msg').val();
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!regex.test(email)) {
            alert('Please enter valid email');
            return false;
        }

        fname = $.trim(fname);
        subject = $.trim(subject);
        email = $.trim(email);
        msg = $.trim(msg);

        if (fname != '' && email != '' && msg != '') {
            var values = "fname=" + fname + "&subject=" + subject + "&email=" + email + " &msg=" + msg;
            $.ajax({
                type: "POST",
                url: "mail.php",
                data: values,
                success: function () {
                    $('#fname').val('');
                    $('#subject').val('');
                    $('#email').val('');
                    $('#msg').val('');

                    $('.cf-msg').fadeIn().html('<div class="alert alert-success"><strong>Success!</strong> Email has been sent successfully.</div>');
                    setTimeout(function () {
                        $('.cf-msg').fadeOut('slow');
                    }, 4000);
                }
            });
        } else {
            $('.cf-msg').fadeIn().html('<div class="alert alert-danger"><strong>Warning!</strong> Please fillup the informations correctly.</div>')
        }
        return false;
    });



}(jQuery));
