var viewer = document.getElementById("viewer");
var ctx = viewer.getContext("2d");
var balls = [];
var colors = ['#FFFF00','#FF66FF','#0099FF','#33CC33','#996600'];
var started = false;
var clock = null;

function drawImage(x, y, width, height, src)
{
	var image = new Image();
	image.onload = function()
	{
		ctx.drawImage( image, x, y, width, height);
	}
	image.src = src;
}


function createBall()
{
	var ball = [];
	ball[0] = Math.floor((Math.random() * 600) + 100);   // x
	ball[1] = Math.floor((Math.random() * 200) + 100);   // y
	ball[2] = Math.floor((Math.random() * 25) + 5);      // radius
	ball[3] = Math.floor(Math.random() * colors.length); // color
	ball[4] = Math.floor((Math.random() * 10) - 5);   // dx
	ball[5] = Math.floor((Math.random() * 10) - 5);   // dy
	balls.push(ball);
}

function drawBalls()
{
	ctx.clearRect(0, 0, viewer.width, viewer.height);
	drawImage( 0, 0, 100, 100, "IroGraphic.png"); // add image
	for(j = 0; j < balls.length; j++)
	{
		var ball = balls[j];
		ctx.beginPath();
		ctx.arc(ball[0], ball[1], ball[2], 0, 2 * Math.PI);
		ctx.fillStyle = colors[ball[3]];
		ctx.fill();
	}
}

function updateBalls()
{
	for(j = 0; j < balls.length; j++)
	{
		var ball = balls[j];
		
		// Adjust x and y based on dx and dy.
		ball[0] = ball[0] + ball[4];
		ball[1] = ball[1] + ball[5];
		
		// Check boundaries.
		var bounce = false;
		if((ball[0] - ball[2] < 0)|| // x - r (west)
		   (ball[0] + ball[2] > viewer.width)) // x + r (east)
		{
			ball[4] = 0 - ball[4]; // reverse dx sign
			bounce = true;
		}
		if((ball[1] - ball[2] < 0) || // y - r (north)
		   (ball[1] + ball[2] > viewer.height)) // y + r (south)
		{
			ball[5] = 0 - ball[5]; // reverse dy sign
			bounce = true;
		}
		if(bounce)
		{
			ball[2] = Math.floor((Math.random() * 25) + 5);      // radius
			ball[3] = Math.floor(Math.random() * colors.length); // color
		}
	}
	drawBalls();
}

function mouseDown(event)
{
	var rect = viewer.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	var j = 0;
	var found = false;
	for(; j < balls.length; j++)
	{
		var ball = balls[j];
		var dx = ball[0]-x;
		var dy = ball[1]-y;
		if( Math.sqrt((dx)*(dx) + (dy)*(dy)) < ball[2] )
		{
			found = true;
			break;
		}
	}
	if(found)
	{		
		balls.splice(j,1);
		drawBalls();
	}
}

function keyUp(event)
{
	var code = event.keyCode ? event.keyCode : event.which;
	// p 80
	if(code==80) hitClock();
}

function hitClock()
{
	if(started) stopClock();
	else startClock();
}

function startClock()
{
	clock = setInterval(updateBalls, 200);
	started = true;
}

function stopClock()
{
	started = false;
	clearInterval(clock);
	drawBalls();
}

var ballCount = Math.floor((Math.random() * 30) + 20);
for(j = 0; j < ballCount; j++)
{
	createBall();
}

viewer.width = 800;
viewer.height = 600;
//viewer.style.backgroundImage  = "url('./nebula/dev/a/" + scene["bg"] + "')";
//viewer.style.backgroundSize = "contain";
viewer.addEventListener("mousedown", mouseDown, false);
var body = document.getElementsByTagName("BODY")[0];
body.addEventListener("keyup", keyUp, false);

drawBalls();