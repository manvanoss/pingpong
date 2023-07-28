const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// this variable are for the graphics and score

const paddleHeight = 100;
const paddleWidth = 10;
const ballRadius = 10;
let paddle1Y = canvas.height /2 - paddleHeight /2;
let paddle2Y = canvas.height /2 - paddleHeight /2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let player1Score = 0;
let player2Score = 0;
let isGameStared = false;

//drawing of the game
function drawRect(x, y, width, height, color) {
//function to draw a rectangle on canvas

    ctx.fillStyle = color;  
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
// Function to draw a circle on the canvas

ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawNet(){
// Function to draw the net in the middle of the canvas

    for(let i = 0; i<canvas.height; i += 40) {
        drawRect(canvas.width/2-1, i, 2, 20, '#000');
    }
}

function drawScore(){
// Function to draw the scores of player 1 and player 2 on the canvas
    ctx.font = '30px Arial';
    ctx.fillText(player1Score, 150, 50);
    ctx.fillText(player2Score, canvas.width - 150, 50);

}

function draw() {
 // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the paddles
    drawRect(0, paddle1Y, paddleWidth, paddleHeight, '#000' );
    drawRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight, '#000');

  // Draw the ball
    drawCircle(ballX, ballY, ballRadius, '#000');

  // Draw the net
    drawNet();

  // Draw the scores
    drawScore();

  // Update ball position if game is started
    if (isGameStarted){
        ballX += ballSpeedX;
        ballY += ballSpeedY;
    }

  // Ball collision with top and bottom walls
    if(ballY <= ballRadius || ballY >= canvas.height - ballRadius){
        ballSpeedY = -ballSpeedY;
    }

  // Ball collision with paddles
    if (
        ballX <= paddleWidth &&
        ballY >= paddle1Y &&
        ballY <= paddle1Y + paddleHeight ||
        ballX >= canvas.width - paddleWidth - ballRadius &&
        ballY <= paddle2Y && 
        ballY <= paddle2Y + paddleHeight
    ){
        ballSpeedX = -ballSpeedX;
    }
    // Ball collision with paddles2
    if (
        ballX >= canvas.width - paddleWidth - ballRadius && // Ball hits the right edge of paddle2
        ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight // Ball is within the height of paddle2
      ) {
        ballSpeedX = -ballSpeedX;
      }

    //simple Ai paddle
    // Calculate the center of paddle2
  
      const paddle2CenterY = paddle2Y + paddleHeight / 2;

  // Calculate the center of the ball
 
     const ballCenterY = ballY;

     function movePaddle2() {
        // Adjust the speed of paddle2 movement here (smaller value = faster movement)
        const paddle2Speed = 5;
      
        if (paddle2CenterY < ballCenterY) {
          // If the ball is below the center of paddle2, move paddle2 down
          paddle2Y += paddle2Speed;
        } else if (paddle2CenterY > ballCenterY) {
          // If the ball is above the center of paddle2, move paddle2 up
          paddle2Y -= paddle2Speed;
        }
      
        // Ensure that paddle2 does not go out of the canvas boundaries
        if (paddle2Y < 0) {
          paddle2Y = 0;
        } else if (paddle2Y > canvas.height - paddleHeight) {
          paddle2Y = canvas.height - paddleHeight;
        }
      }
       // Call the AI function to move paddle2
  movePaddle2();

  // Ball out of bounds
    if (ballX < 0){
        player2Score++;
        resetBall();
    }
    else if (ballX > canvas.width){
        player1Score++
        resetBall();
    }

  // Check if a player wins
    if(player1Score >= 5 || player2Score >= 5){
        isGameStared =false;
        ballSpeedX = 0;
        ballSpeedY = 0;
        showTryAgainButton();
}

}

function startGame(){
    isGameStarted = true;
    hideStartButton();
    hideTryAgainButton();
    resetBall();
    player1Score = 0;
    player2Score = 0;
}


function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = -ballSpeedY;
  }

  function showTryAgainButton() {
    document.getElementById('tryAgainButton').style.display = 'block';
  }
  
  function hideTryAgainButton() {
    document.getElementById('tryAgainButton').style.display = 'none';
  }
  
  function hideStartButton() {
    document.getElementById('startButton').style.display = 'none';
  }
  
  // Mouse move event to control paddle1
  canvas.addEventListener('mousemove', function (e) {
    const mousePos = calculateMousePos(e);
    paddle1Y = mousePos.y - paddleHeight / 2;
  });
  
  // Function to calculate mouse position on canvas
  function calculateMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const mouseX = e.clientX - rect.left - root.scrollLeft;
    const mouseY = e.clientY - rect.top - root.scrollTop;
    return {
      x: mouseX,
      y: mouseY,
    };
  }
  
  // Click event for start button
  document.getElementById('startButton').addEventListener('click', startGame);
  
  // Click event for try again button
  document.getElementById('tryAgainButton').addEventListener('click', function () {
    startGame();
    hideTryAgainButton();
  });
  
  // Set game loop interval
  const framesPerSecond = 60;
  setInterval(draw, 1000 / framesPerSecond);