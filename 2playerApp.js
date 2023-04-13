const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let pacman;
let pacman2;
let runGame;
const p1Score = document.getElementById('p1-score');
const p2Score = document.getElementById('p2-score');
let score1 = 0;
let score2 = 0;

canvas.width = window.innerWidth;
canvas.height = 1100;

// class to create boundary boxes
class Box {
    static width = 40;
    static height = 40;
    constructor({ position, image }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image
    }
    render() {
        ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'blue';
        ctx.stroke();
    }
}

// class to create pacman
class Pacman {
    constructor({ position, velocity, color }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians = 0.75;
        this.openRate = 0.12;
        this.rotation = 0;
        this.color = color;
    }
    draw() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x, -this.position.y);
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, this.radians, 2 * Math.PI - this.radians);
        ctx.lineTo(this.position.x, this.position.y)
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.radians < 0 || this.radians > 0.75) {
            this.openRate = -this.openRate
        }
        this.radians += this.openRate

    }
}

// class to create dots
class Dot {
    constructor({ position }) {
        this.position = position;
        this.radius = 3;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
    }
}

// class to create ghost
class Ghost {
    static speed = 2
    constructor({ position, velocity, color }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = color;
        this.prevCollisions = [];
        this.speed = 5;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

}

window.addEventListener('DOMContentLoaded', function () {
    pacman = new Pacman({
        position: {
            x: Box.width + Box.width / 2,
            y: Box.height + Box.height / 2
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'yellow'
    })
    pacman2 = new Pacman({
        position: {
            x: Box.width * 19 + Box.width / 2,
            y: Box.height * 25 + Box.height / 2
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'pink'
    })

    runGame = setInterval(playGame, 20);
})

const boxArray = [];
const dots = [];
const ghosts = [
    new Ghost({
        position: {
            x: Box.width * 10 + Box.width / 2,
            y: Box.height * 12 + Box.height / 2
        },
        velocity: {
            x: 0,
            y: -Ghost.speed
        },
        color: 'red'
    }),
    // new Ghost({
    //     position: {
    //         x: Box.width * 10 + Box.width / 2,
    //         y: Box.height * 13 + Box.height / 2
    //     },
    //     velocity: {
    //         x: 0,
    //         y: Ghost.speed
    //     },
    //     color: 'cyan'
    // }),
    // new Ghost({
    //     position: {
    //         x: Box.width * 10 + Box.width / 2,
    //         y: Box.height * 12 + Box.height / 2
    //     },
    //     velocity: {
    //         x: 0,
    //         y: -Ghost.speed
    //     },
    //     color: 'white'
    // })
]

// creates map of the pacman game
const map = [
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '0'],
    ['0', '.', '0', '0', '0', '.', '0', '0', '0', '.', '0', '.', '0', '0', '0', '.', '0', '0', '0', '.', '0'],
    ['0', '.', '.', '0', '.', '.', '.', '0', '.', '.', '.', '.', '.', '0', '.', '.', '.', '0', '.', '.', '0'],
    ['0', '0', '.', '.', '.', '0', '.', '.', '.', '0', '0', '0', '.', '.', '.', '0', '.', '.', '.', '0', '0'],
    ['0', '.', '.', '0', '.', '.', '.', '0', '.', '.', '.', '.', '.', '0', '.', '.', '.', '0', '.', '.', '0'],
    ['0', '.', '0', '0', '0', '.', '0', '0', '0', '.', '0', '.', '0', '0', '0', '.', '0', '0', '0', '.', '0'],
    ['0', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '0'],
    ['0', '.', '0', '0', '0', '.', '0', '0', '0', '.', '0', '.', '0', '0', '0', '.', '0', '0', '0', '.', '0'],
    ['0', '.', '.', '0', '.', '.', '.', '0', '.', '.', '.', '.', '.', '0', '.', '.', '.', '0', '.', '.', '0'],
    ['0', '0', '.', '.', '.', '0', '.', '.', '.', '0', '0', '0', '.', '.', '.', '0', '.', '.', '.', '0', '0'],
    ['0', '.', '.', '0', '.', '.', '.', '0', '.', '.', '.', '.', '.', '0', '.', '.', '.', '0', '.', '.', '0'],
    ['0', '.', '0', '0', '0', '.', '0', '.', '.', '0', '-', '0', '.', '.', '0', '.', '0', '0', '0', '.', '0'],
    ['0', '.', '.', '.', '.', '.', '.', '.', '0', '-', '-', '-', '0', '.', '.', '.', '.', '.', '.', '.', '0'],
    ['0', '.', '0', '0', '0', '.', '0', '.', '.', '0', '0', '0', '.', '.', '0', '.', '0', '0', '0', '.', '0'],
    ['0', '.', '.', '0', '.', '.', '.', '0', '.', '.', '.', '.', '.', '0', '.', '.', '.', '0', '.', '.', '0'],
    ['0', '0', '.', '.', '.', '0', '.', '.', '.', '0', '0', '0', '.', '.', '.', '0', '.', '.', '.', '0', '0'],
    ['0', '.', '.', '0', '.', '.', '.', '0', '.', '.', '.', '.', '.', '0', '.', '.', '.', '0', '.', '.', '0'],
    ['0', '.', '0', '0', '0', '.', '0', '0', '0', '.', '0', '.', '0', '0', '0', '.', '0', '0', '0', '.', '0'],
    ['0', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '0'],
    ['0', '.', '0', '0', '0', '.', '0', '0', '0', '.', '0', '.', '0', '0', '0', '.', '0', '0', '0', '.', '0'],
    ['0', '.', '.', '0', '.', '.', '.', '0', '.', '.', '.', '.', '.', '0', '.', '.', '.', '0', '.', '.', '0'],
    ['0', '0', '.', '.', '.', '0', '.', '.', '.', '0', '0', '0', '.', '.', '.', '0', '.', '.', '.', '0', '0'],
    ['0', '.', '.', '0', '.', '.', '.', '0', '.', '.', '.', '.', '.', '0', '.', '.', '.', '0', '.', '.', '0'],
    ['0', '.', '0', '0', '0', '.', '0', '0', '0', '.', '0', '.', '0', '0', '0', '.', '0', '0', '0', '.', '0'],
    ['0', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']

]

// replacing 0 with blue rectangle and . with a dot
for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === '0') {
            boxArray.push(new Box({
                position:
                {
                    x: Box.width * j,
                    y: Box.height * i
                }
            }));
        } else if (map[i][j] === '.') {
            dots.push(new Dot({
                position:
                {
                    x: j * Box.width + Box.width / 2,
                    y: i * Box.height + Box.height / 2
                }
            }));

        }
    }
}

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    arrowUp: {
        pressed: false
    },
    arrowLeft: {
        pressed: false
    },
    arrowDown: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    }
};

let lastKey = '';
let lastKey2 = '';
document.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break
        case 'ArrowUp':
            keys.arrowUp.pressed = true;
            lastKey2 = 'ArrowUp';
            break
        case 'ArrowDown':
            keys.arrowDown.pressed = true;
            lastKey2 = 'ArrowDown';
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = true;
            lastKey2 = 'ArrowLeft';
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = true;
            lastKey2 = 'ArrowRight';
            break
    }
})

document.addEventListener('keyup', function (e) {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break
        case 's':
            keys.s.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            break
        case 'd':
            keys.d.pressed = false;
            break
        case 'ArrowUp':
            keys.arrowUp.pressed = false;
            break
        case 'ArrowDown':
            keys.arrowDown.pressed = false;
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = false;
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = false;
            break
    }
})

// function to detect collision between pacman and the boxes
function collide({ circle, rectangle }) {
    const padding = Box.width / 2 - circle.radius - 1;
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)
}

// runs functions to play the game
function playGame() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePacman();

    movePacman2();

    eatDots();

    boundary();
    boundary2();

    pacman.update();
    pacman2.update();

    collision();

    rotatePacman();
    rotatePacman2();
}

// Move player 1 pacman
function movePacman() {
    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boxArray.length; i++) {
            const boundary = boxArray[i];
            if (collide({
                circle: {
                    ...pacman, velocity: {
                        x: 0,
                        y: -5
                    }
                },
                rectangle: boundary
            })) {
                pacman.velocity.y = 0;
                break;
            } else {
                pacman.velocity.y = -5;
            }
        }
    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boxArray.length; i++) {
            const boundary = boxArray[i];
            if (collide({
                circle: {
                    ...pacman, velocity: {
                        x: -5,
                        y: 0
                    }
                },
                rectangle: boundary
            })) {
                pacman.velocity.x = 0;
                break;
            } else {
                pacman.velocity.x = -5;
            }
        }
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boxArray.length; i++) {
            const boundary = boxArray[i];
            if (collide({
                circle: {
                    ...pacman, velocity: {
                        x: 0,
                        y: 5
                    }
                },
                rectangle: boundary
            })) {
                pacman.velocity.y = 0;
                break;
            } else {
                pacman.velocity.y = 5;
            }
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boxArray.length; i++) {
            const boundary = boxArray[i];
            if (collide({
                circle: {
                    ...pacman, velocity: {
                        x: 5,
                        y: 0
                    }
                },
                rectangle: boundary
            })) {
                pacman.velocity.x = 0;
                break;
            } else {
                pacman.velocity.x = 5;
            }
        }
    }
}

// Move player 2 pacman
function movePacman2() {
    if (keys.arrowUp.pressed && lastKey2 === 'ArrowUp') {
        for (let i = 0; i < boxArray.length; i++) {
            const boundary = boxArray[i];
            if (collide({
                circle: {
                    ...pacman2, velocity: {
                        x: 0,
                        y: -5
                    }
                },
                rectangle: boundary
            })) {
                pacman2.velocity.y = 0;
                break;
            } else {
                pacman2.velocity.y = -5;
            }
        }
    } else if (keys.arrowLeft.pressed && lastKey2 === 'ArrowLeft') {
        for (let i = 0; i < boxArray.length; i++) {
            const boundary = boxArray[i];
            if (collide({
                circle: {
                    ...pacman2, velocity: {
                        x: -5,
                        y: 0
                    }
                },
                rectangle: boundary
            })) {
                pacman2.velocity.x = 0;
                break;
            } else {
                pacman2.velocity.x = -5;
            }
        }
    } else if (keys.arrowDown.pressed && lastKey2 === 'ArrowDown') {
        for (let i = 0; i < boxArray.length; i++) {
            const boundary = boxArray[i];
            if (collide({
                circle: {
                    ...pacman2, velocity: {
                        x: 0,
                        y: 5
                    }
                },
                rectangle: boundary
            })) {
                pacman2.velocity.y = 0;
                break;
            } else {
                pacman2.velocity.y = 5;
            }
        }
    } else if (keys.arrowRight.pressed && lastKey2 === 'ArrowRight') {
        for (let i = 0; i < boxArray.length; i++) {
            const boundary = boxArray[i];
            if (collide({
                circle: {
                    ...pacman2, velocity: {
                        x: 5,
                        y: 0
                    }
                },
                rectangle: boundary
            })) {
                pacman2.velocity.x = 0;
                break;
            } else {
                pacman2.velocity.x = 5;
            }
        }
    }
}

// splice dots when pacman collide with dots and score goes up by 10
function eatDots() {
    for (let i = dots.length - 1; 0 <= i; i--) {
        const dot = dots[i];

        dot.draw();

        if (Math.hypot(dot.position.x - pacman.position.x, dot.position.y - pacman.position.y) < dot.radius + pacman.radius) {
            dots.splice(i, 1);
            score1 += 10;
            p1Score.innerText = score1;
        } else if (Math.hypot(dot.position.x - pacman2.position.x, dot.position.y - pacman2.position.y) < dot.radius + pacman2.radius) {
            dots.splice(i, 1);
            score2 += 10;
            p2Score.innerText = score2;
        }
    }
}

// function to detect collision between pacman and ghost
// function to move around ghost
function collision() {
    const collisions = [];
    ghosts.forEach(ghost => {

        ghost.update();

        if (Math.hypot(ghost.position.x - pacman.position.x, ghost.position.y - pacman.position.y) < ghost.radius + pacman.radius) {
            clearTimeout(runGame);
            alert('Player 1 lost!');
        } else if (Math.hypot(ghost.position.x - pacman2.position.x, ghost.position.y - pacman2.position.y) < ghost.radius + pacman2.radius) {
            clearTimeout(runGame);
            alert('Player 2 lost!');
        } else if (score1 + score2 === 3100) {
            if (score1 > score2) {
                alert('Player 1 wins!');
                clearTimeout(runGame);
            } else if (score2 > score1) {
                alert('Player 2 wins!');
                clearTimeout(runGame);
            }
        }

        boxArray.forEach((boundary) => {
            if (!collisions.includes('down') &&
                collide({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: 0,
                            y: ghost.speed
                        }
                    },
                    rectangle: boundary
                })) {
                collisions.push('down');
            }
            if (
                !collisions.includes('left') &&
                collide({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: -ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })) {
                collisions.push('left');
            }
            if (
                !collisions.includes('right') &&
                collide({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })) {
                collisions.push('right');
            }

            if (
                !collisions.includes('up') &&
                collide({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: 0,
                            y: -ghost.speed
                        }
                    },
                    rectangle: boundary
                })) {
                collisions.push('up');
            }
        })

        if (collisions.length > ghost.prevCollisions.length) {
            ghost.prevCollisions = collisions;
        }

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
            if (ghost.velocity.x > 0) {
                ghost.prevCollisions.push('up');
            } else if (ghost.velocity.x < 0) {
                ghost.prevCollisions.push('left');
            } else if (ghost.velocity.y < 0) {
                ghost.prevCollisions.push('right');
            } else if (ghost.velocity.y > 0) {
                ghost.prevCollisions.push('down');
            }

            const pathways = ghost.prevCollisions.filter((collision) => {
                return !collisions.includes(collision)
            })

            const direction = pathways[Math.floor(Math.random() * pathways.length)];

            switch (direction) {
                case 'down':
                    ghost.velocity.y = ghost.speed;
                    ghost.velocity.x = 0;
                    break
                case 'up':
                    ghost.velocity.y = -ghost.speed;
                    ghost.velocity.x = 0;
                    break
                case 'right':
                    ghost.velocity.y = 0;
                    ghost.velocity.x = ghost.speed;
                    break
                case 'left':
                    ghost.velocity.y = 0;
                    ghost.velocity.x = -ghost.speed;
                    break
            }
            ghost.prevCollisions = [];
        }

    })

}
// stops pacman whenever it touches the box 
function boundary() {
    boxArray.forEach((boundary) => {
        boundary.render();
        if (
            collide({
                circle: pacman,
                rectangle: boundary
            })
        ) {
            pacman.velocity.y = 0;
            pacman.velocity.x = 0;
        };
    })
}

// stops pacman2 whenever it touches the box 
function boundary2() {
    boxArray.forEach((boundary) => {
        boundary.render();
        if (
            collide({
                circle: pacman2,
                rectangle: boundary
            })
        ) {
            pacman2.velocity.y = 0;
            pacman2.velocity.x = 0;
        };
    })
}

// rotate pacman's opening when ever pacman's velocity changes
function rotatePacman() {
    if (pacman.velocity.x > 0) {
        pacman.rotation = 0;
    } else if (pacman.velocity.x < 0) {
        pacman.rotation = Math.PI;
    } else if (pacman.velocity.y > 0) {
        pacman.rotation = Math.PI / 2;
    } else if (pacman.velocity.y < 0) {
        pacman.rotation = Math.PI * 1.5;
    }
}

// rotate pacman2's opening when ever pacman's velocity changes
function rotatePacman2() {
    if (pacman2.velocity.x > 0) {
        pacman2.rotation = 0;
    } else if (pacman2.velocity.x < 0) {
        pacman2.rotation = Math.PI;
    } else if (pacman2.velocity.y > 0) {
        pacman2.rotation = Math.PI / 2;
    } else if (pacman2.velocity.y < 0) {
        pacman2.rotation = Math.PI * 1.5;
    }
}