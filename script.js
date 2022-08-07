var getCanvas = document.getElementById("game");
var canvas = getCanvas.getContext("2d");

let gameValue = 0
const settings = {
    fruits: {
        total: 25
    },
    map: {
        width: getCanvas.width,
        height: getCanvas.height
    },
    player: {
        velocity: 170,
        points: 0,
        snake: 0,
        x: 0,
        y: 0
    },
    color: {
        map: "white",
        player: "#75ff73"
    },
    keyboard: {
        lastKey: '0'
    }
}

const fruitsDB = {
    max: settings.fruits.total,
    count: 0,
    ready: false
};

const fruits = fruitsDB || {};
const snakeDB = {
    total: 0
}
const snake = snakeDB || {};

function play() {
    function endGame(type) {
        if (gameValue == 1) {
            if (type == "player_win") {
                settings.keyboard.lastKey = undefined;
                document.getElementById('pontos').innerHTML = `Voce venceu!<br>(!) Pressione F5 para jogar novamente.`
            } else if (type == "player_lost") {
                settings.keyboard.lastKey = undefined;
                document.getElementById('pontos').innerHTML = `Voce perdeu.<br>(!) Pressione F5 para jogar novamente.`
            }

            //canvas.fillStyle = "red"//settings.color.map;
            canvas.clearRect(0, 0, settings.map.height, settings.map.width);
        }
    }

    //edit game status
    function game(type, x, y, color) {
        if (settings.player.points == fruitsDB.max) gameValue = gameValue + 1, endGame("player_win");

        if (type == "clearPixel") {
            canvas.fillStyle = settings.color.map;
            canvas.fillRect(x, y, 50, 50);
        } else if (type == "setPixel") {
            canvas.fillStyle = color;
            canvas.fillRect(x, y, 50, 50);
        } else if (type == "fruitDetector") {
            if (fruitsDB.count == 0) {
                fruitsDB.count = fruitsDB.max
            } else {
                const requestFruit = fruits[`fruit${fruitsDB.count}`]
                const saveFruitID = fruitsDB.count
                fruitsDB.count = fruitsDB.count - 1
                if (requestFruit.x == settings.player.x && requestFruit.y == settings.player.y) {
                    settings.player.points = Number(settings.player.points) + 1
                    if (settings.player.velocity !== 40) settings.player.velocity = settings.player.velocity - 10
                    document.getElementById('pontos').innerHTML = `Pontos: ${Number(settings.player.points)}`
                    fruits[`fruit${saveFruitID}`].x = undefined
                } else {
                    game("fruitDetector");
                }
            }
        }
    }

    //wasd system
    function keyboardListener(key) {
        if (key == "s") {
            if (settings.player.y == settings.map.width - 50) return gameValue = gameValue + 1, endGame("player_lost");

            snakeSystem();
            game("setPixel", settings.player.x, settings.player.y + 50, settings.color.player)

            settings.player.snake = settings.player.snake + 1
            snake[`position${settings.player.snake + 1}`] = {
                x: settings.player.x,
                y: settings.player.y + 50
            }
            snakeDB.total = snakeDB.total + 1

            settings.player.y = settings.player.y + 50
            game("fruitDetector");
        }
        if (key == "w") {
            if (settings.player.y == 0) return gameValue = gameValue + 1, endGame("player_lost");

            snakeSystem();
            game("setPixel", settings.player.x, settings.player.y - 50, settings.color.player)

            settings.player.snake = settings.player.snake + 1
            snake[`position${settings.player.snake + 1}`] = {
                x: settings.player.x,
                y: settings.player.y - 50
            }
            snakeDB.total = snakeDB.total + 1

            settings.player.y = settings.player.y - 50
            game("fruitDetector");
        }
        if (key == "d") {
            if (settings.player.x == settings.map.width - 50) return gameValue = gameValue + 1, endGame("player_lost");

            snakeSystem();
            game("setPixel", settings.player.x + 50, settings.player.y, settings.color.player)

            settings.player.snake = settings.player.snake + 1
            snake[`position${settings.player.snake + 1}`] = {
                x: settings.player.x + 50,
                y: settings.player.y
            }
            snakeDB.total = snakeDB.total + 1

            settings.player.x = settings.player.x + 50
            game("fruitDetector");
        }
        if (key == "a") {
            if (settings.player.x == 0) return gameValue = gameValue + 1, endGame("player_lost");

            snakeSystem();
            game("setPixel", settings.player.x - 50, settings.player.y, settings.color.player)

            settings.player.snake = settings.player.snake + 1
            snake[`position${settings.player.snake + 1}`] = {
                x: settings.player.x - 50,
                y: settings.player.y
            }
            snakeDB.total = snakeDB.total + 1

            settings.player.x = settings.player.x - 50
            game("fruitDetector");
        }
    }

    //snake growing system
    function snakeSystem() {
        const getData = snake[`position${settings.player.snake - settings.player.points + 1}`]
        game("clearPixel", getData.x, getData.y)
    }

    //spawn fruits
    function fruitSystem() {
        if (fruitsDB.ready == true) {
            if (fruitsDB.count !== 0) {
                const getFruitID = fruitsDB.count
                const requestFruit = fruits[`fruit${getFruitID}`]

                game("setPixel", requestFruit.x, requestFruit.y, '#ff7393')

                fruitsDB.count = fruitsDB.count - 1
                fruitSystem();
            }
        } else {
            if (settings.fruits.total !== 0) {
                settings.fruits.total = settings.fruits.total - 1
                fruitsDB.count = fruitsDB.count + 1

                fruits[`fruit${fruitsDB.count}`] = {
                    x: Math.floor(Math.random() * settings.map.height / 50) * 50,
                    y: Math.floor(Math.random() * settings.map.height / 50) * 50
                }
                fruitSystem()
            } else {
                fruitsDB.ready = true;
                fruitSystem()
            }
        }
    }
    fruitSystem();

    //auto walk when press wasd
    function autoWalk() {
        setTimeout(() => {
            keyboardListener(settings.keyboard.lastKey)
            autoWalk();
        }, settings.player.velocity)
    }
    autoWalk();

    //player spawn
    canvas.fillStyle = settings.color.player;
    canvas.fillRect(settings.player.x, settings.player.y, 50, 50);

    snakeDB.total = snakeDB.total + 1
    snake[`position${settings.player.snake + 1}`] = {
        x: settings.player.x,
        y: settings.player.y
    }
}
play();

document.addEventListener('keydown', (event) => {
    if (["w", "a", "s", "d"].includes(event.key)) settings.keyboard.lastKey = event.key
})
