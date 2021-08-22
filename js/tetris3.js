/**
 * author: sunquan 2017/3/9.
 *
 * 本文件用js语言实现一个贪吃蛇游戏；
 */
function Snake(para) {
  // 在新建蛇时可以修改的参数
  this.gameSpeed = para.gameSpeed; //游戏开场时的速度

  // 初始化的参数
  this.snakeBody = [];  // 蛇的身体
  this.eggNum = 0;      // 蛋的个数
  this.headerTr = 0;    // 蛇头的横坐标
  this.headertd = 0;    // 蛇头的纵坐标
  this.tds = [];        // 装整个棋盘的方块
  this.block = '';      // 染了色的方块
  this.timer = '';      // 初始一个计时器
  this.preDirection;
}

// 蛇的转向
Snake.prototype.turn = function () {
  var that = this,
    direction = arguments[0];

  // 限制回退操作
  if ((that.preDirection == "left" && that.direction == "right") || (that.preDirection == "right" && direction == "left")) {
    return;
  } else if ((that.preDirection == "up" && direction == "down") || (that.preDirection == "down" && direction == "up")) {
    return;
  }
  that.preDirection = direction;

  clearInterval(that.timer);

  if (direction == "left") {
    this.headertd -= 1;
  } else if (direction == "right") {
    this.headertd += 1;
  } else if (direction == "up") {
    this.headerTr -= 1;
  } else if (direction == "down") {
    this.headerTr += 1;
  }

  if (this.headertd > 29 || this.headerTr > 29 || this.headertd < 0 || this.headerTr < 0) {
    clearInterval(that.timer);
    alert("已撞晕，game over");
    window.location.reload();
  } else if (this.biteMyself()) {
    clearInterval(that.timer);
    alert("咬自己了，game over");
    window.location.reload();
  } else {
    if (this.snakeBody[this.snakeBody.length - 1] == this.block) {
      this.createEgg();
      this.snakeBody[0].style.backgroundColor = "black";
    } else {
      this.snakeBody[0].style.backgroundColor = "#cbcbcb";
      this.snakeBody[0].style.border = "1px solid #cbcbcb";
      this.snakeBody.shift();
    }

    this.snakeBody.push(this.tds[this.headerTr][this.headertd]);


    this.snakeBody[this.snakeBody.length - 1].style.backgroundColor = "black";
    this.snakeBody[this.snakeBody.length - 1].style.border = "1px solid black";
  }

  that.timer = setInterval(function () {
    that.turn(direction);
  }, that.gameSpeed);
};

/**
 * 随机的给一个方块上色
 * color:方块的背景色，和边框颜色
 */
Snake.prototype.createRandomBlock = function (color) {
  var horizon = parseInt(Math.random() * 30),
    vertical = parseInt(Math.random() * 30);

  this.block = this.tds[horizon][vertical];
  this.block.style.backgroundColor = color;
  this.block.style.border = "1px solid " + color;

  return {
    horizon: horizon,
    vertical: vertical
  };
}

/**
 * 创建一个新的蛋，并刷新游戏成绩，提高游戏速度
 */
Snake.prototype.createEgg = function () {
  this.createRandomBlock('red');

  document.getElementsByClassName("warm")[0].innerHTML = "你吃了" + this.eggNum + "个蛋";

  this.eggNum += 1;

  if (this.eggNum == 2) {
    this.gameSpeed -= 30;
  } else if (this.eggNum == 4) {
    this.gameSpeed -= 30;
  } else if (this.eggNum == 6) {
    this.gameSpeed -= 30;
  } else if (this.eggNum == 8) {
    this.gameSpeed -= 30;
  } else if (this.eggNum == 8) {
    this.gameSpeed -= 20;
  }
}

// 判断蛇是否咬到自己
Snake.prototype.biteMyself = function () {
  for (var b = 0, snakelength = this.snakeBody.length - 1; b < snakelength; b++) {
    if (this.snakeBody[snakelength] == this.snakeBody[b]) {
      return true;
    }
  }
  return false;
}

// 画棋盘，即地图
Snake.prototype.drawChessBoard = function () {
  /*画棋盘 把所有td装到一个二维数组里*/
  var chessboard = document.getElementById('chessboard');
  for (var i = 0; i < 30; i++) {
    // 插入一个行元素，appendChild还返回插入的节点
    var thistr = chessboard.appendChild(document.createElement('tr')); //
    var thistds = [];
    // 给行元素插入30个列元素
    for (var k = 0; k < 30; k++) {
      thistds[k] = thistr.appendChild(document.createElement('td'));
    }
    // 这样，数组tds的每一个值，又都是一个数组。通过两层下标就可以准确的取到对应的td块
    this.tds[i] = thistds;
  }
}

Snake.prototype.listenKeyDown = function () {
  var that = this;
  // 监听上下左右四个按键
  window.addEventListener("keydown", function (e) {
    if (e.keyCode == "40") {
      that.turn("down");
    } else if (e.keyCode == "37") {
      that.turn("left");
    } else if (e.keyCode == "39") {
      that.turn("right");
    } else if (e.keyCode == "38") {
      that.turn("up");
    }
  });
}

init();

function init() {
  var snake = new Snake({
    gameSpeed: 200
  });

  snake.drawChessBoard();// 画棋盘
  snake.listenKeyDown(); //监听上下左右按钮

  var firstBody = snake.createRandomBlock('black');// 随机上色一个方块
  snake.headerTr = firstBody.horizon;// 初始化蛇头位置
  snake.headertd = firstBody.vertical;

  snake.snakeBody.push(snake.tds[snake.headerTr][snake.headertd]);//将蛇头放入蛇身

  snake.createEgg();// 创建一个蛋
}