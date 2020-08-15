window.addEventListener('load', function() {
	// Объявление переменных
	var marquee = document.querySelector('.js-marquee p');
	var light = document.querySelectorAll('.js-light-marquee');
	var child;
	var rnd;
	var lightRnd;
	var width;
	var colors = ['#38C046', '#FFA800', '#F75245', '#44C7F1', '#E20000'];
	var wW = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

	// Функция рандома подсветки
	function rndLight(el) {
		child = el.children;
		for (var i = 0; i < child.length; i++) {
			child[i].className = "";
			child[i].style.removeProperty('--color');
		}
		rnd = Math.floor(Math.random() * child.length);
		lightRnd = Math.floor(Math.random() * 4);
		child[rnd].style.setProperty('--color', colors[rnd]);
		child[rnd].classList.add('light_' + lightRnd);
	}

	// Функция возвращает ширину, добавляет анимацию для описания под заголовком
	function marqueeWidth(el) {
		var scW = el.scrollWidth + 36;
		el.style.width = scW + 'px';
		el.classList.add('marquee-anim');
	}

	// Функция возвращает ширину для списков
	function marqueeWidth2(els) {
		els.forEach(function(el) {
			var scW = el.scrollWidth - wW;
			if (scW < 0) {
				width = 48;
			} else {
				width = scW + 48;
			}
			el.style.setProperty('--marquee-move', width);
			el.classList.add('move');
		});
	}

	// Вызов функций
	marqueeWidth(marquee);

	window.onresize = (function() {
		wW = this.innerWidth;
		if (wW < 1280) {
			marqueeWidth2(light);
		}
	});

	if (wW < 1280) {
		marqueeWidth2(light);
	}

	light.forEach(function(el) {
		rndLight(el);
		setInterval(function() {
			rndLight(el);
		}, 4800);
	});
});