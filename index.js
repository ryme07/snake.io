window.onload = function() {

    let canvas;
    let canvasHeight = 600;
    let canvasWidth = 900;
    let snakeColor = '#ff0000';
    let appleColor = '#33cc33';
    let blockSize = 30;
    let ctx;
    let delay = 100;
    let snake;
    let apple;
    let widthInBlocks = canvasWidth/blockSize;
    let heightInBlocks = canvasHeight/blockSize;
    let score;
    let timeout


    function init() {

        canvas = document.createElement('canvas');
        canvas.height = canvasHeight;
        canvas.width = canvasWidth;
        canvas.style.border = "30px solid grey";
        canvas.style.margin = "0px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd"
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d')
        snake = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        apple = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }
    
    function refreshCanvas() {
        
        snake.advance();

        if(snake.checkCollision()) {
            console.log("game over");
            gameOver();
            
        } else {
             
            if(snake.isEatingApple(apple)) {
                score++;
                console.log("le score" + score);
                snake.ateApple = true;

                do {

                    apple.setNewPosition();
                } 
                while(apple.isOnSnake(snake))

            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            snake.draw();
            apple.draw();
            timeout = setTimeout(refreshCanvas, delay);
        }
    }


    function gameOver() {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;
        ctx.strokeText("Game Over", centerX, centerY - 180);
        ctx.fillText("Game Over", centerX, centerY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centerX, centerY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centerX, centerY - 120);
        ctx.restore();
    }

    function restart() {
        snake = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        apple = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }

    function drawScore() {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;
        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore();
    }

    function drawBlock(ctx, position) {

        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    // snake constructor 

    function Snake(body, direction) {
        
        this.body = body;
        this.direction = direction;
        this.ateApple = false;

        this.draw = function() {

            ctx.save();
            ctx.fillStyle = snakeColor;

            for(let i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }

            ctx.restore();
        };

        this.advance = function() {

            let nextPosition = this.body[0].slice();

            switch(this.direction) {

                case "left":
                    nextPosition[0] -= 1;
                break;
                case "right":
                    nextPosition[0] += 1;
                break;
                case "down": 
                    nextPosition[1] += 1;
                break;
                case "up": 
                    nextPosition[1] -= 1;
                break;
                default: 
                throw("Invalid direction");

            }

            this.body.unshift(nextPosition);
            if(!this.ateApple) {

                this.body.pop();
            } else {
                this.ateApple = false;
            }
        };

        this.setDirection = function(newDirection) {

            let allowedDirections;

            switch(this.direction) {

                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                break;
                case "down": 
                case "up": 
                    allowedDirections = ["left", "right"];
                break;
                default: 
                throw("Invalid direction");
            }

        
            if(allowedDirections.indexOf(newDirection) > - 1) {

                this.direction = newDirection;
            }
        };

        this.checkCollision = function() {

            let wallCollision = false;
            let snakeCollision = false;
            let head = this.body[0];
            let restOfBody = this.body.slice(1);
            let snakeX = head[0];
            let snakeY = head[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthInBlocks - 1;
            let maxY = heightInBlocks - 1; 
            let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {

                wallCollision = true;
            }

            for(let i = 0; i < restOfBody.length; i++) {

                if(snakeX === restOfBody[i][0] && snakeY === restOfBody[i][1]){
                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision;
        }

        this.isEatingApple  = function(appleToEat) {

            let head = this.body[0];

            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {

                console.log('pomme mangée');
                    return true;

                } else {

                    return false;
                }
        }

    }

    // apple constructor
    function Apple(position) {

        this.position = position;

        this.draw = function () {

            ctx.save();
            ctx.fillStyle = appleColor;
            // beginPath()
            ctx.beginPath();
            let radius = blockSize/2;
            let x = this.position[0] * blockSize + radius;
            let y = this.position[1] * blockSize + radius;
            // arc()
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        }

        this.setNewPosition = function () {

            let newX = Math.round(Math.random() * (widthInBlocks - 1));
            let newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        }

        this.isOnSnake =  function(snakeToCheck) {

            let isOnSnake = false;

            for(let i = 0; i < snakeToCheck.body.lenght; i++) {

                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }

            return isOnSnake;

        }

    }

    //end of apple constructor

    document.onkeydown = function handleKeyDown(e) {

        let key = e.keyCode;
        let newDirection;
        console.log(key);

        switch(key) {

            case 37:
                newDirection = "left";
            break;
            case 39:
                newDirection = "right";
            break;
            case 38:
                newDirection = "up";
            break;
            case 40: 
                newDirection = "down";
            break;
            case 32: 
            restart();
            return;
            default: 
            return;
        };
        snake.setDirection(newDirection);
    }


    init();

}