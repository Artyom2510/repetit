window.addEventListener('load', function() {

	this.requestAnimFrame = (function() {
		return this.requestAnimationFrame
	})();

	var canvas = document.querySelector('.js-starts');
	var c = canvas.getContext('2d');

	var numStars = 500;
	var radius = '0.'+Math.floor(Math.random() * 9) + 1;
	var focalLength = canvas.width *2;
	var warp = false;
	var centerX;
	var centerY;

	var stars = [], star;
	var i;

	initializeStars();

	function executeFrame() {
		requestAnimFrame(executeFrame);
		moveStars();
		drawStars();
	}

	function initializeStars() {
		centerX = canvas.width / 2;
		centerY = canvas.height / 2;

		stars = [];
		for(i = 0; i < numStars; i++){
			star = {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				z: Math.random() * canvas.width,
				o: '0.' + Math.floor(Math.random() * 99) + 1
			};
			stars.push(star);
		}
	}

	function moveStars() {
		for(i = 0; i < numStars; i++){
			star = stars[i];
			star.z--;

			if(star.z <= 0){
				star.z = canvas.width;
			}
		}
	}

	function drawStars() {
		var pixelX;
		var pixelY;
		var pixelRadius;
		
		// Resize to the screen
		if (canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			initializeStars();
		}
		if (!warp) {
			c.fillStyle = "rgba(0,10,20,1)";
			c.fillRect(0,0, canvas.width, canvas.height);
		}
		c.fillStyle = "rgba(209, 255, 255, " + radius + ")";
		for(i = 0; i < numStars; i++) {
			star = stars[i];

			pixelX = (star.x - centerX) * (focalLength / star.z);
			pixelX += centerX;
			pixelY = (star.y - centerY) * (focalLength / star.z);
			pixelY += centerY;
			pixelRadius = 1 * (focalLength / star.z);

			c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
			c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
		}
	}

	executeFrame();

	// Ускорение работает 1 раз
	var easterEgg2 = document.querySelector('.js-easter-egg2');
	var click = 0;
	var flagClick = true;
	function easterEgg2Click() {
		if (flagClick) {
			click++;
			flagClick = !flagClick;
			warp = !warp;
			c.clearRect(0, 0, canvas.width, canvas.height);
			executeFrame();
			setTimeout(function() {
				warp = !warp;
				c.clearRect(0, 0, canvas.width, canvas.height);
				executeFrame();
				flagClick = !flagClick;
				// Удалил клик
			}, 4000);
		}
		if (click === 4) {
			// var easterEgg2This = this;
			this.removeEventListener('click', easterEgg2Click);
			this.style.pointerEvents = 'none';
		}
	}

	// Добавил клик
	easterEgg2.addEventListener('click', easterEgg2Click);

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
	
	var getBoundingX;

	// Функция рандома подсветки
	function rndLight(el) {
		child = el.children;
		for (var i = 0; i < child.length; i++) {
			child[i].className = "";
			child[i].style.removeProperty('--color');
		}
		rnd = Math.floor(Math.random() * child.length);
		lightRnd = Math.floor(Math.random() * 4);
		if (wW < 1280) {
			getBoundingX = child[rnd].getBoundingClientRect().x;
			while (getBoundingX < 0 || getBoundingX > wW) {
				rnd = Math.floor(Math.random() * child.length);
				getBoundingX = child[rnd].getBoundingClientRect().x;
			}
		}
		child[rnd].style.setProperty('--color', colors[rnd]);
		child[rnd].classList.add('light_' + lightRnd);
	}

	// Функция возвращает ширину, добавляет анимацию для описания под заголовком
	function marqueeWidth(el) {
		el.style.width = 'auto';
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

	setTimeout(function() {
		marquee.innerText = 'Дружище! Текст уже уехал, а ты все еще здесь. Может пора уже нажать куда-нибудь. Вот тебе подсказка - нажми на космонавта. А слышал анекдот? - Василий Иванович! Анку током убило! - Как это произошло? - Да вот аккумулятор на голову упал... ¡Esto es lo mucho que debes estar confundido para tener tiempo de copiar este texto, pegarlo en un traductor de Google y darte cuenta de que eres una persona especial única! ¡Sí, estás tan solo! No hay más en el mundo. •−− •− ••• •• •−•• •• •−−− •• •−− •− −• −−− •−− •• −−−• •−•−•− −••• • •−•• −•−− • •−− •−•• • ••• ••− −−••−− −−− − ••• − •− −• −••− •−−• • − −••− −•− •− •−•−•− −• • −•• −−− −−• •−• •• −••• −−− •−− −− −• • ••• • •−−− −−−• •− ••• −−••−−';
		marqueeWidth(marquee);
		marquee.classList.add('marquee-anim_more-time');
	}, 90000);

	function reuseMarqueeWidth() {
		if (wW < 1280) {
			marqueeWidth2(light);
		}
	}

	window.onresize = (function() {
		wW = this.innerWidth;
		reuseMarqueeWidth();
	});

	reuseMarqueeWidth()

	light.forEach(function(el) {
		rndLight(el);
		setInterval(function() {
			rndLight(el);
		}, 4800);
	});

	// пасхалка-Поехали
	var easterEgg3 = document.querySelector('.main-cards__easter-egg');
	document.querySelector('.js-easter-egg-3').addEventListener('click',function () {
		easterEgg3.classList.add('main-cards__easter-egg_see');
		$(this).css('pointer-events', 'none');
	});

	document.querySelector('.cards').addEventListener('scroll', function() {
		var x = document.querySelector('.js-bounding').getBoundingClientRect().left;
		easterEgg3.style.left = x + 'px';
	});
});