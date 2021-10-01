function init() {
  canvas = document.getElementById("snakeCanvas");
  H = canvas.height = 585;
  W = canvas.width = 1000;
  pen = canvas.getContext("2d");
  cs = 30;
  game_over = "false";
  score = 0;
  food = getRandomFood();

  food_img = new Image();
  food_img.src = "images/apple.png";
  trophy = new Image();
  trophy.src = "images/trophy.png";

  snake = {
    init_len: 5,
    color: "#FDBF5F",
    cells: [],
    size: 5,
    direction: "right",

    /*Created Snake*/
    createSnake: function () {
      for (var i = this.init_len; i >= 0; i--) {
        this.cells.push({
          x: i,
          y: 0
        });
      }
    },

    drawSnake: function () {
      pen.fillStyle = this.color;
      for (var i = 0; i < this.cells.length; i++)
        pen.fillRect(this.cells[i].x * cs, this.cells[i].y * cs, cs, cs);
    },

    updateSnake: function () {
      var headX = this.cells[0].x;
      var headY = this.cells[0].y;

      for (let i = 2; i <= this.size - 1; i++) {
        if (this.cells[i].x == food.x && this.cells[i].y == food.y) {
          food = getRandomFood();
        }
      }

      if (headY == food.y && headX == food.x) {
        this.size += 1;
        score++;
        food = getRandomFood();
      } else {
        this.cells.pop();
      }

      var nextX, nextY;

      if (this.direction == "right") {
        nextX = headX + 1;
        nextY = headY;
      } else if (this.direction == "left") {
        nextX = headX - 1;
        nextY = headY;
      } else if (this.direction == "down") {
        nextX = headX;
        nextY = headY + 1;
      } else {
        nextX = headX;
        nextY = headY - 1;
      }

      this.cells.unshift({
        x: nextX,
        y: nextY
      });

      var last_x = Math.round(W / cs);
      var last_y = Math.round(H / cs);

      for (let i = 5; i <= this.size; i++) {
        if (this.cells[i].x == headX && this.cells[i].y == headY) {
          game_over = true;
        }
      }

      if (
        this.cells[0].y < 0 ||
        this.cells[0].x < 0 ||
        this.cells[0].x > last_x ||
        this.cells[0].y > last_y - 1
      ) {
        game_over = true;
      }
    }
  };

  function keyPressed(e) {
    if (e.key == "ArrowRight" && snake.direction != "left") {
      snake.direction = "right";
    } else if (e.key == "ArrowLeft" && snake.direction != "right") {
      snake.direction = "left";
    } else if (e.key == "ArrowDown" && snake.direction != "up") {
      snake.direction = "down";
    } else if (e.key == "ArrowUp" && snake.direction != "down") {
      snake.direction = "up";
      console.log(e.key);
    }
  }

  snake.createSnake();
  document.addEventListener("keydown", keyPressed);
}

function draw() {
  pen.clearRect(0, 0, W, H);
  snake.drawSnake();
  pen.drawImage(food_img, food.x * cs, food.y * cs, cs, cs);

  pen.fillStyle = "#fff";
  pen.drawImage(trophy, 20, 15, cs + 3, cs + 3);
  pen.font = "16px Montserrat";
  pen.fillText(score, 30, 30);
}

function update() {
  snake.updateSnake();
}

function getRandomFood() {
  var foodX = Math.round((Math.random() * (W - cs)) / cs);
  var foodY = Math.round((Math.random() * (H - cs)) / cs);

  var food = {
    x: foodX,
    y: foodY,
    color: "red"
  };

  return food;
}

/*Game Loop*/
function gameloop() {
  if (game_over == true) {
    clearInterval(f);
    document.getElementById("modal").style.display = "flex";
    document.getElementById(
      "score"
    ).innerHTML = `Your score is <span class="score-text">${score}</span>`;
    return;
  }
  draw();
  update();
}

init();
f = setInterval(gameloop, 80);
