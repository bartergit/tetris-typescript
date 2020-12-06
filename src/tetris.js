function calculateNewPosition() {
    coordinateArray = [];
    for (var i = 0; i < currentFigure.length; i++) {
        for (var j = 0; j < currentFigure[i].length; j++) {
            if (currentFigure[i][j] == 1) {
                switch (rotation) {
                    case 0:
                        coordinateArray.push(new Position(i, j));
                        break;
                    case 1:
                        coordinateArray.push(new Position(currentFigure[i].length - j - 1, i));
                        break;
                    case 2:
                        coordinateArray.push(new Position(currentFigure[i].length - i - 1, currentFigure.length - j - 1));
                        break;
                    case 3:
                        coordinateArray.push(new Position(j, currentFigure.length - i - 1));
                        break;
                }
            }
        }
    }
    if (!moveHorizontal(0)) {
        rotation = rotation == 0 ? 3 : rotation - 1;
        calculateNewPosition();
    }
}
function mergeLines() {
    for (var i = 0; i < collisionArray.length - 1; i++) {
        var flag = true;
        for (var j = 0; j < collisionArray[i].length - 1; j++) {
            flag = collisionArray[i][j] && collisionArray[i][j + 1] && flag;
        }
        if (flag) {
            level += 1;
            levelLabel.innerText = "Level " + level;
            collisionArray.splice(i, 1);
            var newArr = new Array(10);
            collisionArray.unshift(newArr);
        }
    }
}
function drawNextFigure() {
    ctxForNextFigure.clearRect(0, 0, blockSize * 4, blockSize * 4);
    ctxForNextFigure.fillStyle = nextColor;
    for (var i = 0; i < nextFigure.length; i++) {
        for (var j = 0; j < nextFigure[i].length; j++) {
            if (nextFigure[i][j] == 1) {
                ctxForNextFigure.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
            }
        }
    }
}
function draw() {
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, blockSize * 10, blockSize * 20);
    ctx.fillStyle = currentColor;
    ctx.strokeStyle = "black";
    calculateNewPosition();
    coordinateArray.forEach(function (coord) {
        ctx.fillRect((pos.x + coord.x) * blockSize, (pos.y + coord.y) * blockSize, blockSize, blockSize);
        // ctx.strokeRect((pos.x + coord.x) * blockSize, (pos.y + coord.y) * blockSize, blockSize, blockSize);
    });
    for (var i = 0; i < collisionArray.length; i++) {
        for (var j = 0; j < collisionArray[i].length; j++) {
            if (collisionArray[i][j]) {
                ctx.fillStyle = collisionArray[i][j];
                ctx.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
                // ctx.strokeRect(j * blockSize, i * blockSize, blockSize, blockSize);
            }
        }
    }
}
function updateY() {
    calculateNewPosition();
    var gameEnd = false;
    coordinateArray.forEach(function (coord) {
        if (collisionArray[coord.y + pos.y + 1][coord.x + pos.x]) {
            coordinateArray.forEach(function (coord) {
                gameEnd = pos.x == startPos.x - (currentFigure.length / 2 | 0) && startPos.y == pos.y;
                collisionArray[coord.y + pos.y][coord.x + pos.x] = currentColor;
            });
            renew();
            mergeLines();
            drawNextFigure();
            clearInterval(updateTimer);
            if (gameEnd) {
                levelLabel.innerHTML = "LOSE";
            }
            else {
                updateTimer = setInterval(updateY, 1000 / level);
            }
            return;
        }
    });
    pos.y += 1;
}
var figures = {
    "O": [[1, 1], [1, 1]],
    "J": [[1, 0, 0], [1, 0, 0], [1, 1, 0]],
    "T": [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    "I": [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    "Z": [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
    "S": [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
    "L": [[0, 0, 1], [0, 0, 1], [0, 1, 1]]
};
var Position = /** @class */ (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    return Position;
}());
function chooseFigure() {
    var keys = Object.keys(figures);
    var index = Math.floor(Math.random() * keys.length);
    return figures[keys[index]];
}
function chooseColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}
function moveHorizontal(sign) {
    for (var ind in coordinateArray) {
        var coord = coordinateArray[ind];
        var newPos = coord.x + pos.x + sign;
        if (newPos < 0 || newPos >= 10 || collisionArray[coord.y + pos.y][newPos]) {
            return false;
        }
    }
    pos.x += sign;
    return true;
}
//setup
var ctxForNextFigure = document.getElementById("nextFigure").getContext("2d");
var ctx = document.getElementById("canvas").getContext("2d");
document.addEventListener('keydown', function (event) {
    if (event.key == "ArrowLeft") {
        moveHorizontal(-1);
    }
    if (event.key == "ArrowRight") {
        moveHorizontal(1);
    }
    if (event.code == "Space" || event.key == "ArrowUp") {
        rotation = rotation == 3 ? 0 : rotation + 1;
    }
    if (event.code == "Enter" || event.key == "ArrowDown") {
        speedUp = 45;
        clearInterval(updateTimer);
        updateTimer = setInterval(updateY, 1000 / level / speedUp);
    }
});
function renew() {
    speedUp = 1;
    rotation = 0;
    currentFigure = nextFigure;
    pos = new Position(startPos.x - (currentFigure.length / 2 | 0), startPos.y);
    currentColor = nextColor;
    nextFigure = chooseFigure();
    nextColor = chooseColor(colors);
}
var blockSize = 25;
var colors = ["#ba7735", "#efd091", "#85aac5", "#024f94", "#050814"];
var fps = 60;
var rotation;
var currentFigure;
var nextFigure = chooseFigure();
var currentColor;
var nextColor = chooseColor(colors);
var startPos = new Position(4, 0);
var speedUp;
var pos;
var updateTimer;
var drawTimer;
var level;
var coordinateArray;
var collisionArray;
var levelLabel = document.getElementById("level");
//start game
function start() {
    level = 5;
    levelLabel.innerHTML = "Level 1";
    collisionArray = new Array(21);
    for (var i = 0; i < 20; i++) {
        collisionArray[i] = new Array(10);
        for (var j = 0; j < 10; j++) {
            collisionArray[i][j] = null;
        }
    }
    collisionArray[20] = new Array(10);
    for (var j = 0; j < 10; j++) {
        collisionArray[20][j] = "black";
    }
    renew();
    drawNextFigure();
    clearInterval(updateTimer);
    clearInterval(drawTimer);
    drawTimer = setInterval(draw, 1000 / fps);
    updateTimer = setInterval(updateY, 1000 / level / speedUp);
}
//# sourceMappingURL=tetris.js.map