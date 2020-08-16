$(function () {
	var imgSvgArray = {};

	function imgSvg() {
		$('img.img-svg').each(function () {
			var $img = $(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');
			var $svg;

			if (typeof imgSvgArray[imgURL] !== 'undefined') {
				$svg = $(imgSvgArray[imgURL]);
				if (typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass + ' replaced-svg');
				}
				$img.replaceWith($svg);
			} else {
				$.ajax({
					url: imgURL,
					async: false,
					dataType: 'xml',
					success: function (data) {
						$svg = $(data).find('svg');

						if (typeof imgID !== 'undefined') {
							$svg = $svg.attr('id', imgID);
						}

						$svg = $svg.removeAttr('xmlns:a');

						if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
							$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
						}

						imgSvgArray[imgURL] = $svg[0].outerHTML;

						if (typeof imgClass !== 'undefined') {
							$svg = $svg.attr('class', imgClass + ' replaced-svg');
						}

						$img.replaceWith($svg);
					}
				});
			}
		});
	}

	imgSvg();

	$('body').on('DOMNodeInserted', function () {
		imgSvg();
	});

	// Функция для инициализации попапов
	function initPopup(popup, btn) {
		popup.switchPopup({
			btnClass: btn,
			displayClass: 'popup_display',
			visibleClass: 'popup_visible',
			duration: 300,
			overflow: true,
		})
	}

	// Попап-Форма
	var popupSendSignal = $('.js-popup-send-signal');
	initPopup(popupSendSignal, 'js-tgl-signal');
	popupSendSignal.on('beforeClose', function() {
			hideArrow();
		});

	// Функция, прячущая стрелочку
	function hideArrow() {
		popupSendSignal.removeClass('popup_with-arrow');
	}

	// Добавление бордера на поля по наведению
	var formfield = $('.js-formfield');
	var field = $('.js-field');

	formfield.on({
		'mouseenter': function() {
			$(this).addClass('formfield_green');
		},
		'mouseleave': function() {
			if (!$(this).children(field).is(':focus')) {
				$(this).removeClass('formfield_green');
			}
		}
	});

	field.on({
		'focus': function() {
			$(this).parent().addClass('formfield_green');
		},
		'blur': function() {
			// if (!$(this).val().length)
			$(this).parent().removeClass('formfield_green');
		}
	});

	// Маска для телефона
	var tel = $('input[type="tel"]');
	tel.inputmask('+7 999 999 99 99');

	// if (tel.val().indexOf('_') === -1)

	// Работа с формой
	var form = $('.js-form');
	var errorUpload = $('.js-error-upload');
	var upload = $('.js-upload');
	var doc = $('.js-doc');
	var formats = ['doc', 'pdf'];
	var submit = $('.js-submit');
	var maxFileSize = 3 * 1024 * 1024;
	var expansion;
	var value;
	var size = 0;
	var file = null;

	// Показ ошибки
	function showError(ert) {
		errorUpload.text(ert);
	}

	// Скрытие ошибки
	function hideError() {
		errorUpload.text("");
	}

	// Ошибки для загружаемого фаила
	var errorTextFormat = "Выберите файл с расширением doc";
	var errorTextSize = "Файл более 3 Мб или пустой";

	// Загрузка фаила
	upload.on('change', function () {
		file = $(this)[0].files[0];
		if (!!file) {
			value = file.name;
			size = file.size;
			expansion = value.toLowerCase().split('.').pop();
			formats.map(function(format) {
				if(format !== expansion) {
					showError(errorTextFormat);
					submit.attr('disabled', 'true').addClass('btn_disabled');
				}
			});

			if (size > maxFileSize || !size) {
				showError(errorTextSize);
				submit.attr('disabled', 'true').addClass('btn_disabled');
			} else {
				hideError();
			}
			if (!formfield.hasClass('formfield_error')) {
				submit.removeAttr('disabled').removeClass('btn_disabled');
			}
			doc
				.addClass('doc_display')
				.children('.doc__name').text(value);
		}
	});

	// Удаляю ошибку по вводу в input
	formfield.on('input', function() {
		$(this)
			.removeClass('formfield_error')
			.children('.formfield__error').text("");
		if (size && !formfield.hasClass('formfield_error')) {
			submit.removeAttr('disabled').removeClass('btn_disabled');
		}
	});

	// Удаление файла
	doc.children('.doc__del').on('click', function() {
		showError(errorTextFormat);
		submit.attr('disabled', 'true').addClass('btn_disabled');
		$(this).siblings('.doc__name').text("");
		upload.val(null);
		size = 0;
		doc.removeClass('doc_display');
	});

	// Отправка формы
	// $('.form').on('beforeSubmit', function(e) {
	form.on('submit', function(e) {
		e.preventDefault();
		var formData = new FormData($(this)[0]);
		if (!size) {
			showError(errorTextFormat);
			submit.attr('disabled', 'true').addClass('btn_disabled');
		} else if (formfield.hasClass('formfield_error')) {
			submit.attr('disabled', 'true').addClass('btn_disabled');
		} else {
			console.log('ajax');
			// $.ajax({
			// 	url: form.attr('action'),
			// 	data: formData,
			// 	method: form.attr('method'),
			// 	async: false,
			// 	contentType: false,
			// 	processData: false,
			// 	success: function(data) {
			// 		if (!data.success) {
			//			console.log(data.errors);
			// 		} else {
			//			popupSendSignal.switchPopup('close');
			//			popupThx.switchPopup('open');
			//		}
			// 	}
			// });
		}
		return false;
	});

	// попап с предложенной вакансией
	var popupVacancy = $('.js-popup-vacancy');
	initPopup(popupVacancy, 'js-tgl-vacancy');

	var query;
	// Запрос по клику на карточку, открытие попапа-вакансия
	$('.js-query').on('click', function() {
		query = $(this).data('query');
		popupVacancy.switchPopup('open'); // <-- эту строку удалить, оставил для теста

		// $.ajax({
		// 	url: query,
		// 	method: 'POST',
		// 	async: false,
		// 	contentType: false,
		// 	processData: false,
		// 	success: function(data) {
		// 		if (!data.success) {
		// 			console.log(data.errors);
		// 		} else {
		// 			// Тут функция подменяющая контент
		// 			// 
		// 			// После открытие попапа
		// 			popupVacancy.switchPopup('open');
		// 		}
		// 	}
		// });
	});

	// Клик по кнопке, переход к  форме
	$('.js-go-to-form').on('click', function() {
		popupVacancy.switchPopup('close');
		popupSendSignal
			.addClass('popup_with-arrow')
			.switchPopup('open');
	});

	// Клик по стрелке
	$('.js-return-vacancy').on('click', function() {
		hideArrow();
		popupSendSignal.switchPopup('close');
		popupVacancy.switchPopup('open');
	});

	// Попап спасибо
	var thx = $('.js-popup-thx');
	initPopup(thx, 'js-tgl-thx');

	// Глитч кнопки
	var	filter = document.querySelector('.svg-sprite');
	var turb = filter.querySelector('#filter feTurbulence');
	var turbVal = { val: 0.000001 };
	var turbValX = { val: 0.000001 };

	var glitchTimeline = function() {
		var timeline = new TimelineMax({
			repeat: -1,
			repeatDelay: 2,
			paused: true,
			onUpdate: function () {
				turb.setAttribute('baseFrequency', turbVal.val + ' ' + turbValX.val);
			}
		});

		timeline
			.to(turbValX, 0.1, { val: 0.5 })
			.to(turbVal, 0.1, { val: 0.02 });
		timeline
			.set(turbValX, { val: 0.000001 })
			.set(turbVal, { val: 0.000001 });
		timeline
			.to(turbValX, 0.2, { val: 0.4 }, 0.4)
			.to(turbVal, 0.2, { val: 0.002 }, 0.4);
		timeline
			.set(turbValX, { val: 0.000001 })
			.set(turbVal, { val: 0.000001 });

		// console.log("duration is: " + timeline.duration());
		return {
			start: function() {
				timeline.play(0);
			},
			stop: function() {
				timeline.pause();
			}
		};
	};

	btnGlitch = new glitchTimeline();

	$('.js-btn-glitch').on({
		mouseenter: function () {
			$(this).removeClass('btn_hovered');
			btnGlitch.stop();
			// if (!$(this).hasClass('btn_disable')) {
			// }
		},
		mouseleave: function () {
			$(this).addClass('btn_hovered');
			btnGlitch.start();
		}
	});

	// Анимация по наведению на гречку
	// var options = {
	// 	template: Power0.easeNone,
	// 	strength: 3,
	// 	points: 120,
	// 	taper: "none",
	// 	randomize: true,
	// 	clamp: false
	// };
	
	// var duration = 15;
	
	// var origin = {
	// 	left: 20,
	// 	top: 20
	// };
	
	// var opacityEase = RoughEase.ease.config(options);
	// var widthEase = RoughEase.ease.config(options);
	// var heightEase = RoughEase.ease.config(options);
	// var originEase = RoughEase.ease.config(options);
	
	// new TimelineMax({
	// 	yoyo: true,
	// 	repeat: -1
	// })
	// 	.to('.grechka p', duration, {
	// 		autoAlpha: .3,
	// 		ease: opacityEase
	// 	})
	// 	.to('.grechka p', duration, {
	// 		scaleX: 1.1,
	// 		ease: widthEase
	// 	}, 0)
	// 	.to('.grechka p', duration, {
	// 		scaleY: 1.1,
	// 		ease: heightEase
	// 	}, 0)
	// 	.to(origin, duration, {
	// 		left: 40,
	// 		top: 40,
	// 		roundProps: 'top, left',
	// 		ease: originEase,
	// 		onUpdate: updateOrigin
	// 	}, 0);
	
	// function updateOrigin() {
	// 	TweenLite.set('.grechka p', {
	// 		transformOrigin: origin.left + '% ' + origin.top + '%'
	// 	});
	// }

});
