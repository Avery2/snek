//canvas and canvas context
let canvas = document.getElementById("tennis");
let context = canvas.getContext("2d");
let warningDiv = document.getElementById("noplay");

//canvas dimensions
canvas.width = 800;
canvas.height = 500;

context.font = context.font.replace(/\d+px/, "20px");

//paddles
let paddle1Y = 250;
let paddle2Y = 250;
let PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 5;

//ball position
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

//ball speed
let ballSpeedX = 10;
let ballSpeedY = 5;

//colors
const PADDLE_COLOR = (BALL_COLOR = TEXT_COLOR = "white");

// scores
let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 3;

let gameOver = false;

//core function
window.onload = function () {
  if (window.innerWidth < 900) {
    canvas.classList.add("hidden");
    return;
  } else if (window.innerWidth > 900) {
    warningDiv.classList.add("hidden");
  }
  let frameRate = 30;

  // Mouse movement moving paddle
  canvas.addEventListener("mousemove", (e) => {
    let mousePos = calculateMousePos(e);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
  const handleClick = (event) => {
    if (gameOver) {
      player1Score = 0;
      player2Score = 0;
      gameOver = false;
    }
  };

  //function that redraws canvas & things at intervals
  setInterval(function () {
    window.addEventListener("mousedown", handleClick);

    moveThings();
    // draw the main canvas
    drawRectangles(0, 0, canvas.width, canvas.height, "black");

    if (gameOver) {
      context.fillStyle = "white";
      if (player1Score >= WINNING_SCORE) {
        context.fillText(
          `You won, you delightful beast!`,
          canvas.width / 3,
          canvas.height / 6
        );
        context.fillText(
          ` Click to start a new game.`,
          canvas.width / 3,
          canvas.height - PADDLE_HEIGHT
        );
      } else if (player2Score >= WINNING_SCORE) {
        context.fillText(
          `You lost to Walter, the AI. He mocks you!`,
          canvas.width / 3,
          canvas.height / 6
        );
        context.fillText(
          ` Click to start a new game.`,
          canvas.width / 2.5,
          canvas.height - PADDLE_HEIGHT
        );
      }
      return;
    }
    drawNet();
    //draw the first paddle
    drawRectangles(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, PADDLE_COLOR);

    //draw the second paddle
    drawRectangles(
      canvas.width - PADDLE_THICKNESS,
      paddle2Y,
      PADDLE_THICKNESS,
      PADDLE_HEIGHT,
      PADDLE_COLOR
    );

    drawBall(BALL_COLOR, ballX, ballY, 10);

    context.fillText(`${player1Score}`, 100, 100);
    context.fillText(`${player2Score}`, canvas.width - 100, 100);
  }, 1000 / frameRate);
};

const moveAI = () => {
  let center = paddle2Y + PADDLE_HEIGHT / 2;
  if (center < ballY - 35) {
    paddle2Y += 10;
  } else if (center > ballY + 35) {
    paddle2Y -= 10;
  }
};

//function for displacing position
const moveThings = () => {
  if (gameOver) {
    return;
  }

  moveAI();
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;
  // if (ballX > canvas.width) {
  //     ballSpeedX = -ballSpeedX
  // }
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.3;
    } else {
      player2Score++;
      ballReset();
    }
  }

  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.3;
    } else {
      player1Score++;
      ballReset();
    }
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
};

const drawNet = () => {
  for (let i = 0; i < canvas.height; i += 40) {
    drawRectangles(canvas.width / 2 - 1, i, 2, 20, "lime");
  }
};
//function that draws canvas and paddles
const drawRectangles = (x, y, width, height, color) => {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
};

//function that draws the ball
const drawBall = (color, x, y, radius) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);
  context.fill();
};

const calculateMousePos = (e) => {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = e.clientX - rect.left - root.scrollLeft;
  let mouseY = e.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
};

const ballReset = () => {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    gameOver = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
};
