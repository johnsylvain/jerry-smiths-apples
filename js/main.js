$(document).ready(function(){

	var audio = document.getElementById('myman');
	var yes = document.getElementById('yes');
	var background = document.getElementById('background');
	var slow = document.getElementById('slow');
	var keys = {};
	var sprite = 0;
	var counter = 0;
	var frames = 0;
	var direc = '';
	var score = 0;
	var charPos = 0;
	var lives = 3;
	var coinCounter = 0;
	var character = $('#character');
	var yVel = 0;
	var gravity = 0.75;
	var isJumping = false;
	var mult = 1;
	var freqApple = 100;
	var freqRotten = 100;
	var game;

	background.volume = 0.7;
	yes.volume = 0.4;
	slow.volume = 0.4;


	$(this).keydown(function(e) {
	    keys[e.keyCode] = true;
	});

	$(this).keyup(function(e) {
	    delete keys[e.keyCode];
	    if (direc === 'backward') {
		    $('#character img').css({
		    	top: -$('#character img').height()/2,
		    	left:0
		    })
	    } else if(direc === 'forward'){
	    	$('#character img').css({
		    	top: -$('#character img').height()*0.75,
		    	left:0
		    })
	    }
	});

	$('#character img').css({
		top:-$('#character img').height()/2
	});
	



	function dropCoin(){
		if(freqApple <= 10) freqApple = 20;
		if (coinCounter >= freqApple) {
			var xPosApple = Math.floor(Math.random() * 650 + 50);
			var $apple = $('<div class="apple" style="left:' + xPosApple + 'px"></div>');
			$('#wrapper').append($apple);
			coinCounter = 0;
			dropRotten();
		}  else {
			coinCounter++;
		}
		var move = function(){
			$($apple).animate({
				top:'+=' + (1) * mult
			},10, function(e){
				if ($(this).position().top >= 500) {
					$(this).remove();
				} else if(detectCollision(character,$(this))){
					console.log('hit');
					score++;
					if(score % 3 == 0){
						mult += 0.2;
						freqApple -= 3;
					}
					console.log(mult);
					if (!yes.paused) {
						yes.pause();
					    yes.currentTime = 0
					    yes.play();
					}else{
					    yes.pause();
					    yes.currentTime = 0
					}
					yes.play();

				    if (direc === 'backward') {
					    $('#character img').css({
					    	top: -$('#character img').height()/2,
					    	left:-$('#character img').width()/9
					    }, function(){
					    	window.setTimeout(function(){
					    		$('#character img').css({
					    			left:'0px'
					    		})
					    	}, 200)
					    })
				    } else if(direc === 'forward'){
				    	$('#character img').css({
					    	top: -$('#character img').height()*0.75,
					    	left:-$('#character img').width()/9
					    }, function(){
					    	window.setTimeout(function(){
					    		$('#character img').css({
					    			left:'0px'
					    		})
					    	}, 200)
					    })
				    }

					$(this).remove();

				} else {
					move();
				}
			});

		}
		move();

	}

	function dropRotten(){
		var xPosRotten = Math.floor(Math.random() * 650 + 50);
		var $rotten = $('<div class="rotten" style="left:' + xPosRotten + 'px"></div>');
		$('#wrapper').append($rotten);
		coinCounter = 0;
		var move = function(){
			$($rotten).animate({
				top:'+=' + (1.3) * mult
			},10, function(e){
				if ($(this).position().top >= 500) {
					$(this).remove();
				} else if(detectCollision(character,$(this))){
					console.log('hit');
					lives--;
					console.log(mult);
					if (!slow.paused) {
						slow.pause();
					    slow.currentTime = 0
					    slow.play();
					}else{
					    slow.pause();
					    slow.currentTime = 0
					}
					slow.play();
					$(this).remove();

				} else {
					move();
				}
			});

		}
		move();

	}
	

	function animateSprite(direction){
		charPos = $('#character').position().left;
		if (counter % 3 === 0) {
	
			if (direction === 'forward') {
				$('#character img').css({
					top:0
				})
				if(sprite < 8){
					sprite++;
				} else if (sprite === 8){
					sprite = 0;
				}
			} else if(direction === 'backward' ){
				$('#character img').css({
					top:-$('#character img').height()/4
				})
				if(sprite > 0){
					sprite--;
				} else if (sprite === 0){
					sprite = 8;
				}
			}
			$('#character img').css({
				left: -sprite * (252 * 2)/9

			});
		};

	}
	function detectCollision(char1, char2){
		var x1 = char1.offset().left;
		var y1 = char1.offset().top;
		var h1 = char1.outerHeight(true);
		var w1 = char1.outerWidth(true);
		var b1 = y1 + h1;
		var r1 = x1 + w1;
		var x2 = char2.offset().left;
		var y2 = char2.offset().top;
		var h2 = char2.outerHeight(true);
		var w2 = char2.outerWidth(true);
		var b2 = y2 + h2;
		var r2 = x2 + w2;

		if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
		return true;
	}
	

	 
	function jump() {
		if (isJumping == false) {
		    yVel = -17;
		    isJumping = true;
		}
	}
	function reset(){
		lives = 3;
		score = 0;
		coinCounter = 0;
		isJumping = false;
		mult = 1;
		freqApple = 100;
		freqRotten = 100;
	}
	console.log(character.position().top);
	function render(){
		if(lives === 0){
			window.clearInterval(game);
			$('#over h3 span').html(score);
			$('#over').fadeIn(300);
		}
		if (isJumping) {
			yVel += gravity;
			character.css({
				bottom:'-=' + yVel + 'px'
			});
		    if ($('#character').position().top > 334) {
		        character.css({
					bottom:'70px'
				});
		        yVel = 0;
		        isJumping = false;
			}
		}
		dropCoin();
		$('#lives').html(lives);
		$('#score').html(score);

		if (counter > 100) {
			counter = 0;
		} else {
			counter++;
		}
		if (counter % 35 ===0) {
			if(frames < 2){
				frames++;
			} else if (frames === 2){
				frames = 0;
			}
		};

        var characterImg = $('#character img');
		for (var direction in keys) {
	        // if (!keys.hasOwnProperty(direction)) continue;
	        if(direction === 37 && direction === 39) break;

	       	//left
	        if (direction == 37) {
	        	if(character.position().left > 50){
		            character.animate({left: "-=7"}, 0);  
	        	}
	            direc = 'forward';
	            animateSprite('backward');              
	        }
	        //right
	        if (direction == 39) {
	        	if(character.position().left < 700){
		            character.animate({left: "+=7"}, 0);  
	        	}
	            direc = 'backward';

	            animateSprite('forward');
	        }

	        if (direction == 38) {
				audio.play();
	            // character.animate({top: "-=50"}, 100);  
				jump();

				characterImg.css({
					left: -characterImg.width()/9
				})
	        };

	    }

	}
	$('#start').click(function(e){
		e.preventDefault();
		$('#logo').hide();
		game = window.setInterval(render, 10);
	})
	$('#reset').click(function(e){
		e.preventDefault();
		reset();
		$("#over").hide();
		game = window.setInterval(render, 10);
	})

})