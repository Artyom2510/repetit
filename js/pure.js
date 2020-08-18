window.addEventListener('load', function() {

	this.requestAnimFrame = (function() {
		return this.requestAnimationFrame
	})();

	var canvas = document.querySelector('.js-starts');
	var c = canvas.getContext('2d');

	var numStars = 1000;
	var focalLength = canvas.width * 2;
	var warp = false;
	var centerX;
	var centerY;

	var stars = [];
	var star;
	var i;

	function initializeStars() {
		centerX = canvas.width / 2;
		centerY = canvas.height / 2;
		
		stars = [];
		for(i = 0; i < numStars; i++) {
			star = {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				z: Math.random() * canvas.width,
				o: '0.' + Math.floor(Math.random() * 99) + 1
			};
			stars.push(star);
		}
	}
	initializeStars();

	function moveStars() {
		for(i = 0; i < numStars; i++) {
			star = stars[i];
			star.z -= 0.1;
			
			if (star.z < 0) {
				star.z = canvas.width;
			}
		}
	}

	function drawStars() {
		var pixelX, pixelY, pixelRadius;
		
		// Resize to the screen
		if (canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			initializeStars();
		}
		if (!warp) {
			c.fillStyle = 'rgba(0, 10, 20, 1)';
			c.fillRect(0, 0, canvas.width, canvas.height);
		}
		for(i = 0; i < numStars; i++) {
			star = stars[i];
			
			pixelX = (star.x - centerX) * (focalLength / star.z);
			pixelX += centerX;
			pixelY = (star.y - centerY) * (focalLength / star.z);
			pixelY += centerY;
			pixelRadius = 1 * (focalLength / star.z);
			
			c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
			c.fillStyle = 'rgba(209, 255, 255, ' + star.o + ')';
		}
	}

	function executeFrame() {
		requestAnimFrame(executeFrame);
		moveStars();
		drawStars();
	}
	executeFrame();

	// document.querySelector('.btn-start').addEventListener('click', function() {
	// 	warp = !warp;
	// 	executeFrame();
	// });

	// Настройка вспомогательных переменных, для сафари
	function updateDeviceProps() {
		var vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', vh + 'px');
	}
	window.addEventListener('resize', updateDeviceProps);
	updateDeviceProps();

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