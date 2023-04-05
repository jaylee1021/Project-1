const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let pacman;
let enemy;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


class Box {

    constructor({ position }) {
        this.position = position;
        this.width = 40;
        this.height = 40;

        this.render = function () {
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }

    }
}

class Pacman {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;

        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.closePath();
        }

        this.update = function () {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }
}

class Enemy {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;

        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'pink';
            ctx.fill();
            ctx.closePath();


        }
        this.update = function () {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }
}


const map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, '', '', '', '', '', '', '', '', '', '', '', '', 0, 0, '', '', '', '', '', '', '', '', '', '', '', 0],
    [0, '', 0, '', 0, '', 0, 0, 0, 0, 0, 0, '', '', '', '', 0, 0, 0, 0, 0, 0, 0, 0, '', '', 0],
    [0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
]


function creatBoxes() {
    const boxArray = [];
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 0) {
                boxArray.push(new Box({
                    position:
                    {
                        x: 40 * j,
                        y: 40 * i
                    }
                }));
            }
        }
    }
    return boxArray;
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'w') {
        pacman.velocity.y = -5;
    } else if (e.key === 's') {
        pacman.velocity.y = 5;
    } else if (e.key === 'a') {
        pacman.velocity.x = -5;
    } else if (e.key === 'd') {
        pacman.velocity.x = 5;
    }
})





pacman = new Pacman({ position: { x: 60, y: 60 }, velocity: { x: 0, y: 0 } })
enemy = new Enemy({ position: { x: 60, y: 120 }, velocity: { x: 0, y: 0 } })

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let boundaries = creatBoxes();
    for (let j = 0; j < map.length; j++) {


    }

    for (let i = 0; i < boundaries.length; i++) {
        boundaries[i].render();
        if (collide(pacman, boundaries[i])) {
            pacman.velocity.y = 0;
            pacman.velocity.x = 0;
        };
    }

    for (let i = 0; i < boundaries.length; i++) {
        boundaries[i].render();
        if (collide(enemy, boundaries[i])) {
            enemy.velocity.y = 0;
            enemy.velocity.x = 0;
        };
    }

    pacman.update();
    enemy.update();

}

animate();

function collide(player, box) {
    return (player.position.y - player.radius + player.velocity.y <= box.position.y + 40 &&
        player.position.y + player.radius + player.velocity.y >= box.position.y &&
        player.position.x - player.radius + player.velocity.x <= box.position.x + 40 &&
        player.position.x + player.radius + player.velocity.x >= box.position.x)
}

