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

});
