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

	// Функция для инициализации попапов
	function initPopup(popup, btn) {
		popup.switchPopup({
			btnClass: btn,
			displayClass: 'popup_display',
			visibleClass: 'popup_visible',
			duration: 300,
			overflow: true,
		});

		// Костыль для скролла в сафари
		popup.on('beforeOpen', function () {
			$('.root').addClass('fixed');
		});

		popup.on('beforeClose', function () {
			$('.root').removeClass('fixed');
		});
	}

	var currentVacancy = '';

	// Попап-Форма
	var popupSendSignal = $('.js-popup-send-signal');
	initPopup(popupSendSignal, 'js-tgl-signal');
	popupSendSignal.on('beforeClose', function () {
		hideArrow();
	});

	popupSendSignal.on('beforeOpen', function (e, popup, state) {
		$.pjax.reload('#form-wrapper', {
			push: false,
			replace: false,
			url: '/site/form/'
		});
	});

	var formfield;
	var field;
	// Кол-во цифр в поле
	var amount = 13;

	function fillInput(input) {
		var value = input.val();
		var length = value.length;
		if (length) {
			if (value[0].match(/[0-9]|\+/)) {
				if (length > 1) {
					if (length > amount) {
						value = value.substr(0, amount);
					}
					var substrValue = value.substr(1);
					var totalVal = value[0];
					for (var i = 0; i < substrValue.length; i++) {
						if (substrValue[i].match(/[0-9]/)) {
							totalVal += substrValue[i];
						}
					}
					input.val(totalVal);
				}
			} else {
				input.val(value.substr(1));
			}
		}
	}

	$(document).on('pjax:success', function (e, data, status, xhr, options) {
		if (options.container === '#ajax-form' && data.indexOf('js-form') === -1) {
			dataLayer.push({'event': 'hr-page-lead'});
			setTimeout(function () {
				popupSendSignal.switchPopup('close');
			}, 3000);
		} else if (options.container === '#form-wrapper') {
			$('.js-vacancy-input').val(currentVacancy);
			currentVacancy = '';
			$('.js-mask').on('input', function() {
				fillInput($(this));
			});
			// Добавление бордера на поля по наведению
			formfield = $('.js-formfield');
			field = $('.js-field');
	
			formfield.on({
				'mouseenter': function () {
					$(this).addClass('formfield_green');
				},
				'mouseleave': function () {
					if (!$(this).children(field).is(':focus')) {
						$(this).removeClass('formfield_green');
					}
				},
				// Удаляю ошибку по вводу в input
				'input': function () {
					$(this)
					.removeClass('formfield_error')
					.children('.formfield__error').text("");
					if (!formfield.hasClass('formfield_error') && !$('.js-error-upload').text().length) {
						$('.js-submit').removeAttr('disabled').removeClass('btn_disabled');
					}
				}
			});
	
			field.on({
				'focus': function () {
					$(this).parent().addClass('formfield_green');
				},
				'blur': function () {
					$(this).parent().removeClass('formfield_green');
				}
			});
		}
	});

	// Функция, прячущая стрелочку
	function hideArrow() {
		popupSendSignal.removeClass('popup_with-arrow');
	}

	// Работа с формой

	var formats = ['docx', 'doc', 'pdf'];
	var maxFileSize = 3 * 1024 * 1024;

	var expansion;
	var isFormat;
	var value;
	var size = 0;
	var file = null;

	// Показ ошибки
	function showError(ert) {
		$('.js-error-upload').text(ert);
	}

	// Скрытие ошибки
	function hideError() {
		$('.js-error-upload').text("");
	}

	// Ошибки для загружаемого фаила
	var errorTextFormat = "Выберите файл с расширением doc, pdf";
	var errorTextSize = "Файл более 3 Мб или пустой";

	// Загрузка фаила
	$(document).on('change', '.js-upload', function () {
		isFormat = false;
		file = $(this)[0].files[0];
		if (!!file) {
			value = file.name;
			size = file.size;
			expansion = value.toLowerCase().split('.').pop();
			var i = 0;
			while (i < formats.length) {
				if (formats[i] === expansion) {
					isFormat = !isFormat;
					break;
				}
				i++;
			}

			if (!isFormat) {
				showError(errorTextFormat);
				$('.js-submit').attr('disabled', 'true').addClass('btn_disabled');
			} else if (size > maxFileSize || !size) {
				showError(errorTextSize);
				$('.js-submit').attr('disabled', 'true').addClass('btn_disabled');
			} else {
				hideError();
			}
			if (!formfield.hasClass('formfield_error') && !$('.js-error-upload').text().length) {
				$('.js-submit').removeAttr('disabled').removeClass('btn_disabled');
			}
			$('.js-doc')
			.addClass('doc_display')
			.children('.doc__name').text(value);
		}
	});

	// Удаление файла
	$(document).on('click', '.js-doc .doc__del', function () {
		$(this).siblings('.doc__name').text("");
		$('.js-upload').val(null);
		hideError();
		size = 0;
		$('.js-doc').removeClass('doc_display');
		if (!formfield.hasClass('formfield_error') && !$('.js-error-upload').text().length) {
			$('.js-submit').removeAttr('disabled').removeClass('btn_disabled');
		}
	});

	// попап с предложенной вакансией
	var popupVacancy = $('.js-popup-vacancy');
	initPopup(popupVacancy, 'js-tgl-vacancy');

	var query;
	var dataBlock = $('.js-content-wraper');
	var cntClick = 0;
	// Запрос по клику на карточку, открытие попапа-вакансия
	$('.js-query').on('click', function () {
		query = $(this).data('query');
		if ($(this).parent().hasClass('js-bounding')) {
			// Спрятать - Поехали
			$('.main-cards__easter-egg').removeClass('main-cards__easter-egg_see');
			$('.js-easter-egg-3').css('pointer-events', 'all');
		}

		if (!$(this).hasClass('card_broken')) {
			$.ajax({
				url: query,
				method: 'POST',
				async: false,
				contentType: false,
				processData: false,
				success: function (data) {
					if (!data.success) {
						console.log(data.errors);
					} else {
						// функция подменяющая контент
						dataBlock.html(data.data);
						// Открытие попапа
						popupVacancy.switchPopup('open');
					}
				}
			});
		} else {
			if (cntClick > 0) {
				$(this)
					.siblings('.item__prev')
					.find('path:nth-child(4)')
					.addClass('broken');
				$(this).removeClass('card_broken');
			} else {
				$(this)
					.siblings('.item__prev')
					.find('path:nth-child(2)')
					.addClass('broken');
			}
			cntClick++;
		}

	});

	// Клик по кнопке, переход к форме
	$('.js-go-to-form').on('click', function () {
		currentVacancy = popupVacancy.find('.popup__title').text();
		popupVacancy.switchPopup('close');
		popupSendSignal
			.addClass('popup_with-arrow')
			.switchPopup('open');
	});

	// Клик по стрелке
	$(document).on('click', '.js-return-vacancy', function () {
		hideArrow();
		popupSendSignal.switchPopup('close');
		popupVacancy.switchPopup('open');
	});

	// Глитч кнопки
	function glithcBtn() {
		$('.js-btn-glitch').addClass('btn_hovered');
		var filter = document.querySelector('.svg-sprite');
		var turb = filter.querySelector('#filter feTurbulence');
		var turbVal = {val: 0.000001};
		var turbValX = {val: 0.000001};

		var glitchTimeline = function () {
			var timeline = new TimelineMax({
				repeat: -1,
				repeatDelay: 2,
				paused: true,
				onUpdate: function () {
					turb.setAttribute('baseFrequency', turbVal.val + ' ' + turbValX.val);
				}
			});

			timeline
			.to(turbValX, 0.1, {val: 0.5})
			.to(turbVal, 0.1, {val: 0.02});
			timeline
			.set(turbValX, {val: 0.000001})
			.set(turbVal, {val: 0.000001});
			timeline
			.to(turbValX, 0.2, {val: 0.4}, 0.4)
			.to(turbVal, 0.2, {val: 0.002}, 0.4);
			timeline
			.set(turbValX, {val: 0.000001})
			.set(turbVal, {val: 0.000001});

			return {
				start: function () {
					timeline.play(0);
				},
				stop: function () {
					timeline.pause();
				}
			};
		};

		btnGlitch = new glitchTimeline();
		btnGlitch.start();

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
	}

	var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
		navigator.userAgent &&
		navigator.userAgent.indexOf('CriOS') == -1 &&
		navigator.userAgent.indexOf('FxiOS') == -1;

	if (isSafari) {
		var findReg = navigator.userAgent;
		var regex = /OS (\d?[0-9])/;
		var matches = findReg.match(regex);
		if (matches) {
			if (matches[1] > 12) {
				glithcBtn();
			}
		} else {
			glithcBtn();
		}
	} else {
		glithcBtn();
	}
});
