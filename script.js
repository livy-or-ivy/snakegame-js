var getCanvas = document.getElementById("game");
var canvas = getCanvas.getContext("2d");

const settings = {
    fruits: {
        total: 15
    },
    map: {
        width: getCanvas.width,
        height: getCanvas.height
    },
    player: {
        points: 0,
        x: 0,
        y: 0
    },
    color: {
        map: "white",
        player: "black"
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

//system
function game(type, x, y, color) {
    if (type == "clearPixel") {
        canvas.fillStyle = settings.color.map;
        canvas.fillRect(x, y, 50, 50);
    } else if (type == "setPixel") {
        canvas.fillStyle = color;
        const multiplier = 50 * Number(settings.player.points)
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
                document.getElementById('pontos').innerHTML = `Pontos: ${Number(settings.player.points)}`
                fruits[`fruit${saveFruitID}`].x = undefined
            } else {
                game("fruitDetector");
            }
        }
    }
}

function keyboardListener(key) {
    if (key == "s" && settings.player.y !== settings.map.width - 50) {
        game("clearPixel", settings.player.x, settings.player.y)
        game("setPixel", settings.player.x, settings.player.y + 50, settings.color.player)
        settings.player.y = settings.player.y + 50
        game("fruitDetector");
    }

    if (key == "w" && settings.player.y !== 0) {
        game("clearPixel", settings.player.x, settings.player.y)
        game("setPixel", settings.player.x, settings.player.y - 50, settings.color.player)
        settings.player.y = settings.player.y - 50
        game("fruitDetector");
    }

    if (key == "d" && settings.player.x !== settings.map.width - 50) {
        game("clearPixel", settings.player.x, settings.player.y)
        game("setPixel", settings.player.x + 50, settings.player.y, settings.color.player)
        settings.player.x = settings.player.x + 50
        game("fruitDetector");
    }

    if (key == "a" && settings.player.x !== 0) {
        game("clearPixel", settings.player.x, settings.player.y)
        game("setPixel", settings.player.x - 50, settings.player.y, settings.color.player)
        settings.player.x = settings.player.x - 50
        game("fruitDetector");
    }
}

function autoWalk() {
    setTimeout(() => {
        keyboardListener(settings.keyboard.lastKey)
        autoWalk();
    }, 50)
}
autoWalk();

//spawn fruits
function fruitSystem() {
    if (fruitsDB.ready == true) {
        if (fruitsDB.count !== 0) {
            const getFruitID = fruitsDB.count
            const requestFruit = fruits[`fruit${getFruitID}`]

            game("setPixel", requestFruit.x, requestFruit.y, 'red')

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


document.addEventListener('keydown', (event) => {
    settings.keyboard.lastKey = event.key
})

//player spawn
canvas.fillStyle = settings.color.player;
canvas.fillRect(settings.player.x, settings.player.y, 50, 50);
