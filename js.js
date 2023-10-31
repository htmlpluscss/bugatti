/* UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

http://htmlpluscss.ru

*/

(function($){

	var showAlertUp,
		windowWidth,
		windowHeight,
		windowScrollTop,
		resizeTimeoutId,
		body = $('body'),
		main = $('.main'),
		$window = $(window);

	$window.on({
		resize: function(){
			clearTimeout(resizeTimeoutId);
			resizeTimeoutId = setTimeout(function(){
				pageResize();
			}, 100);
		},
		load: function(){
			pageResize();

			if($('.datepicker').length>0){
				$.datepicker.setDefaults($.datepicker.regional["ru"]);
				$('.datepicker').datepicker({
					minDate: 1
				});
			}

		},
		scroll: function(){
			windowScrollTop = $window.scrollTop();
		}
	});

	function pageResize(){
		windowWidth = $window.width();
		windowHeight = $window.height();
		main.css('min-height', windowHeight - $('#footer').outerHeight());
	}
	pageResize();

	$window.trigger('scroll');

// header search
	$('.header__search-submit').on('click', function(){
		$(this).parent().addClass('header__search--active');
		$('.header__search-input').focus();
	});
	$('.header__search').on('submit', function(){
		if($('.header__search-input').val()==''){
			return false;
		}
	});

// img-cover
	$('.img-cover').filter('[data-img]').each(function(){
		$(this).css('background-image','url('+$(this).attr('data-img')+')');
	});

// tabs
	$.fn.tabs = function(){

		var tab = function(){
			var t = $(this),
				dt = t.find('.tabs__dt'),
				dd = t.find('.tabs__dd');

			dd.first().before(dt);

			dt
			.wrapAll('<div class="tabs__nav notsel">')
			.on('click',function(){
				var t = $(this);
				t.addClass('tabs__dt--active').siblings('.tabs__dt--active').removeClass('tabs__dt--active');
				dd.removeClass('tabs__dd--active').eq(dt.index(t)).addClass('tabs__dd--active');
			})
			.filter('.tabs__dt--active').length > 0 ?
				dt.filter('.tabs__dt--active').triggerHandler('click') :
				dt.first().triggerHandler('click');

		}

		return this.each(tab);

	};

	$('.tabs').tabs();

// slideShow

	$.fn.slideShow = function(){

		var setSlider = function(){

			var slider = $(this),
				list = slider.find('.slide-show__item'),
				size = list.length,
				navNext = $('<a class="slide-show__next">'),
				navPrev = $('<a class="slide-show__prev">'),
				abscissa = slider.hasClass('slide-show--abscissa'),
				transition = false;

			navNext.add(navPrev).on('click',function(event,nextItemIndex){
				if(transition) {
					return true;
				}
				transition = true;

				var clickRight = $(this).hasClass('slide-show__next');
				var activeItem = list.filter('.slide-show__item--active');
				var nextItem = clickRight ? activeItem.next() : activeItem.prev();

				if(abscissa) {

					if(!clickRight && nextItem.length == 0){
						jump(size);
						setTimeout(function(){
							transition = false;
							navPrev.trigger('click');
						},1);
						return true;
					}
					nextActive(nextItem);
					ul.removeClass('slide-show__ul--jump').css('left',-nextItem.position().left).one(cssAnimation('transition'), function(){
						if(clickRight && nextItem.index() > size){
							jump(nextItem.index() - size);
						}
						transition = false;
					});

				} else {

					if(clickRight){
						slider.addClass('slide-show--right');
						if(nextItem.length == 0){
							nextItem = list.first();
						}
					}
					else {
						slider.addClass('slide-show--left');
						if(nextItem.length == 0){
							nextItem = list.last();
						}
					}
					if(nextItemIndex !== undefined)
						nextItem = list.eq(nextItemIndex);
					nextItem.addClass('slide-show__item--next').one(cssAnimation('animation'), function(){
						nextActive(nextItem);
						list.removeClass('slide-show__item--next');
						slider.removeClass('slide-show--left slide-show--right');
						transition = false;
					});
					navDisk.removeClass('slide-show__nav--current').eq(nextItem.index()).addClass('slide-show__nav--current');

				}
			}).hover(function(){
				slider.addClass('notsel');
			},function(){
				slider.removeClass('notsel');
			});

			if(abscissa) {

				var ul = slider.find('.slide-show__ul');
				ul.append(list.clone());
				list = ul.children();
				list.first().addClass('slide-show__item--active');

			} else {

				var nav = $('<div class="slide-show__nav">');
				for(var i = 0; i < size; i++){
					nav.append('<a></a>');
				}
				var navDisk = nav.children();
				nav.wrapInner('<div class="slide-show__nav-inner">');

				navDisk.on('click',function(){
					if($(this).hasClass('slide-show__nav--current')) {
						return true;
					}
					var index = $(this).index();
					var btnClick = index > list.filter('.slide-show__item--active').index() ? navNext : navPrev;
					btnClick.trigger('click',index);
				});

				list.filter('.slide-show__item--active').length > 0 ?
					navDisk.eq(list.filter('.slide-show__item--active').index()).addClass('slide-show__nav--current') :
					navDisk.first().trigger('click');

				touchX(slider,navNext,navPrev);
				slider.append(nav);

			}

			slider.append(navNext,navPrev);

			function nextActive(n){
				n.addClass('slide-show__item--active').siblings().removeClass('slide-show__item--active');
			}

			function jump(indexNext){
				n = list.eq(indexNext);
				l = n.position().left;
				ul.addClass('slide-show__ul--jump').css('left',-l);
				nextActive(n);
			}

			function timer(time){
				var intervalID;
				slider.on('mouseleave mousemove touchstart touchmove touchend', function(event){
					clearInterval(intervalID);
					if(event.type == 'mousemove' && $(event.target).closest('a').length>0){
						return;
					}
					intervalID = setInterval(function(){
						navNext.triggerHandler('click');
					}, time);
				}).trigger('touchend');
			}
			if(slider.is('[data-timer]')){
				timer(parseInt(slider.attr('data-timer')) * 1000);
			}

		}

		return this.each(setSlider);

	};

	$('.slide-show').not('.slide-show--off').slideShow();

// touch X
	function touchX(b,l,r){
		var xStart, yStart, xEnd, yEnd;
		b.on('touchstart touchmove touchend',function(event){
			if (event.type == 'touchstart') {
				xEnd = 0;
				yEnd = 0;
				xStart = parseInt(event.originalEvent.touches[0].clientX);
				yStart = parseInt(event.originalEvent.touches[0].clientY);
			}
			if (event.type == 'touchmove') {
				xEnd = parseInt(event.originalEvent.touches[0].clientX);
				yEnd = parseInt(event.originalEvent.touches[0].clientY);
			}
			if (event.type == 'touchend') {
				if(xEnd == 0) {
					xStart * 2 > windowWidth ?
						l.trigger('click'):
						r.trigger('click');
				}
				else if (Math.abs(xStart - xEnd) > 50 && Math.abs(xStart - xEnd) > Math.abs(yStart - yEnd)) {
					xStart > xEnd ?
						l.trigger('click'):
						r.trigger('click');
				}
			}
		});
	}

// product
	$('.product__img-list li').on('click', function() {
		$(this).addClass('product__img-list--active').siblings().removeClass('product__img-list--active');
		$('.product__img-big').children().eq($(this).index()).addClass('product__img-big__active').siblings().removeClass('product__img-big__active');
	});


// cart
	if($('.cart').length>0){

		function cartTotal() {

			var cartItems = $('.cart__item'),
				cartItemsCount = cartItems.length,
				cartTotal = 0;

			cartItems.each(function(){

				var count = parseInt($(this).attr('data-count'));
				var price = parseInt($(this).attr('data-price'));
				var total = price * count;

				$(this).find('.cart__count-value').val(count);
				$(this).find('.cart__price-count').text(sep(total));

				cartTotal += total

			});

			$('.total-summ, .header__cart-value').text(sep(cartTotal));

			$('.header__cart-count').attr('class','header__cart-count header__cart-count--'+declension(cartItemsCount,[1,2,3]));
			$('.header__cart-count').text(cartItemsCount);

			$.ajax({
				type: "GET",
				data: $('.cart__body').serialize(),
				url:  $('.cart__body').attr('action')
			});

		}

		function sep(str){
			str = str.toString();
			return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
		}

		$('.cart__count-up, .cart__count-down').on('click', function() {
			var increment = $(this).hasClass('cart__count-up') ? 1 : -1;
			var item = $(this).closest('.cart__item');
			var count = parseInt(item.attr('data-count'));
			count += increment;
			if(count < 1) {
				count = 1;
			}
			item.attr('data-count',count);
			cartTotal();
		});

		$('.cart__count-value').on('change blur keyup', function() {
			var item = $(this).closest('.cart__item');
			var count = parseInt($(this).val());
			if(count < 1 || isNaN(count)) {
				count = 1;
			}
			item.attr('data-count',count);
			cartTotal();
		});

		var autocompleteForSelect = $('.input--autocomplete-for-select');
		var autocompleteSelect = autocompleteForSelect.parent().find('select');
		var autocompleteSelectTags = [];

		autocompleteSelect.children().each(function(){

			autocompleteSelectTags.push($(this).text());

		});

		autocompleteForSelect.autocomplete({
			delay: 0,
			source: autocompleteSelectTags
		});

		autocompleteForSelect.on('change blur',function(){
			var value = $(this).val();
			autocompleteSelect.children().each(function(){

				if($(this).text() == value){
					autocompleteSelect.val($(this).attr('value')).trigger('change');
				}

			});
		});

	}

	$('.cart__btn-next').on('click', function() {
		var top = $('#' + $('.cart__btn-next').attr('href').slice(1)).offset().top;
		$('body, html').animate({scrollTop : top}, 500)
		return false;
	});


// mask
	if($('.mask').length>0){

		$.getScript("/js/jquery.maskedinput.min.js", function(){
			$('.mask').each(function(){
				$(this).mask($(this).attr('data-mask'));
			});
		});

	}

// alert_up
	$.fn.alertUp = function(){

		var box = $('.alert_up'),
			item = box.children();

		var scroolbar = $('<div class="scroolbar">'),
			scroolbarItem = $('<div class="scroolbar__item">');
		scroolbar.html(scroolbarItem);
		body.append(scroolbar);
		var scroolbarWidth = scroolbar.width() - scroolbarItem.width();
		scroolbar.remove();
		if(scroolbarWidth > 0){
			var style = $('<style>');
			style.html('.scroolbarwidth{margin-left:-'+scroolbarWidth+'px}');
			box.append(style);
		}

		box.on('click',function(event){
			var t = $(event.target);
			if(t.is('.alert_up__inner') || t.is('.alert_up__close')){
				box.add(item).addClass('hide');
				body.removeClass('overflow-hidden scroolbarwidth');
			}
		});

		showAlertUp = function (selector) {
			var itemActive = item.filter('.alert_up__item--'+selector);
			body.addClass('overflow-hidden');
			body.toggleClass('scroolbarwidth', windowHeight < body.height());
			box.toggleClass('flexbox--align-center', windowHeight > itemActive.outerHeight());
			item.not(itemActive).addClass('hide');
			box.add(itemActive).removeClass('hide').focus();
		}

		return this.each(function(){
			var selector = $(this).attr('data-alert-up');
			$(this).on('click',function(){
				showAlertUp(selector);
			});
		});

	};

	$('[data-alert-up]').alertUp();

	$('.product__btn-one-click').on('click',function(){
		$('.alert_up__item--one-click').find('[name="sku"]').val($(this).data('sku'));
//		$('.alert_up__name-product').text($('.product__name').text());
		showAlertUp('one-click');
	});

// select

	$.fn.mySelect = function(){

		var select = function(){

			var select = $(this);
			select.wrap('<div class="select notsel">');
			var select_box = select.parent();
			var c = '<span class="select__value"><span class="select__text"></span></span><div class="select__box"><ul>';
			select.children('option').each(function() {
				if($(this).val()!='none')
					c += '<li class="select__li" data-value="' + $(this).val() + '">' + $(this).text() + '</li>';
			});
			c += '</ul></div>';
			select.before(c);

			var box_ul = select.siblings('.select__box');
			var visible = select.siblings('.select__value').children();

			select_box.on('click', function() {
				select_box.hasClass('select--focus') ? box_ul.hide() : box_ul.show();
				select_box.toggleClass('select--focus');
			});

			box_ul.on('click','.select__li', function() {
				select.val($(this).attr('data-value')).trigger('change');
			});
			select.on('change',function(){
				var o = select.children(':selected');
				visible.text(o.text());
				o.attr('value')=='none' ? select_box.addClass('select--default') : select_box.removeClass('select--default');
			}).trigger('change');

		}

		$(document).on('click', function(event) {
			$('.select--focus').not($(event.target).closest('.select')).removeClass('select--focus').find('.select__box').hide();
		});

		return this.each(select);

	};

	$('select').mySelect();

// list-hash

	$('.list-hash-content-nav a').on('click',function(e){

		e.preventDefault();

		var href = $(this).attr('href').substring(1);
		var block = $('#'+href);
		block.slideDown();
		$('body, html').animate({scrollTop : block.offset().top}, 500);

	});

})(jQuery);

// cssAnimation('animation/transition')
function cssAnimation(a){var b,c,d=document.createElement("cssanimation");switch(a){case'animation':b={"animation":"animationend","OAnimation":"oAnimationEnd","MozAnimation":"animationend","WebkitAnimation":"webkitAnimationEnd"};break;case'transition':b={"transition":"transitionend","OTransition":"oTransitionEnd","MozTransition":"transitionend","WebkitTransition":"webkitTransitionEnd"}}for(c in b)if(d.style[c]!==undefined)return b[c]};

// Склонение окончаний
function declension(d,c){var b;var a=d%100;if(a>4&&a<21){b=c['2']}else{a=a%10;if(a==1)b=c['0'];else if(a>1&&a<5)b=c['1'];else b=c['2']}return b};