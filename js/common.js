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

	// Форма
	var popupSendSignal = $('.js-popup-send-signal');
	popupSendSignal
		.switchPopup({
			btnClass: 'js-tgl-signal',
			displayClass: 'popup_display',
			visibleClass: 'popup_visible',
			duration: 300,
			overflow: true,
		})
		.on('beforeClose', function() {
			hideArrow();
		});

	// Функция, прячущая стрелочку
	function hideArrow() {
		popupSendSignal.removeClass('popup_with-arrow');
	}

	// Добавление бордера на на поля
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

	// Маск для телефона
	$('input[type="tel"]').inputmask('+7 999 999 99 99');

	// if ($('input[type="tel"]').val().indexOf('_') === -1)

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
			//			console.log(data.message);
			// 		} else {
			//			popupSendSignal.switchPopup('close');
			//			popupThx.switchPopup('open');
			//		}
			// 	}
			// });
		}
		return false;
	});

	// // Инфо о вакансии
	// function initVacancy(arrays) {
	// 	console.log(arrays[1].title)
	// }

	// попап с предложенной вакансией
	var popupVacancy = $('.js-popup-vacancy');
	popupVacancy.switchPopup({
			btnClass: 'js-tgl-vacancy',
			displayClass: 'popup_display',
			visibleClass: 'popup_visible',
			duration: 300,
			overflow: true,
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

});
