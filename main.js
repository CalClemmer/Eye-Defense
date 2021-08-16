//
let movementDisplay = document.getElementById('buildMenu')
let game = document.getElementById('game')
const ctx = game.getContext('2d');

game.setAttribute('class', 'main-game')
game.setAttribute("height", getComputedStyle(game)["height"]);
game.setAttribute("width", getComputedStyle(game)["width"]);

// ======================ENTITIES==========================

const arrProjectiles = [];
const arrTriangles = [];

class Triangle {
    constructor(x, y, color, length, speed) {
        this.x = x
        this.y = y
        this.color = color
        this.length = length
        this.alive = true
    }

    render() {
    // Draw a triangle
    ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length, this.y);
        ctx.lineTo(this.x + (0.5 * this.length), this.y - (0.8660254 * this.length));
        // ctx.fillStyle = '#228B22';
        ctx.fillStyle = this.color;
        ctx.fill();
    
        this.x += 1;
    }
}


class Turret {
    constructor(x, y, angle) {
        this.x = x
        this.y = y
        this.angle = angle;
    }

    render() {
        let width = 30;
        let height = 30;
        let turretCenter = [4, 0]
        //draw bottom rectangle 
        ctx.fillStyle = '#CCC'; 
        ctx.fillRect(this.x, this.y, width, height);
        ctx.beginPath();

        //draw middle rectangle 
        ctx.fillStyle = '#555';
        ctx.save();
        ctx.translate( this.x + width/2, this.y + height/2);
        ctx.rotate(this.angle - Math.PI/2);
        ctx.fillRect(-turretCenter[0], -turretCenter[1], 8, 30);
        ctx.restore();

        //draw top circle 
        ctx.fillStyle = "red";
        ctx.arc(this.x + 15, this.y + 15, 12, 0, Math.PI * 2, true);
        ctx.fill();

        this.angle += 0.01;
    }

    shoot() {
        console.log('Bang');
        const bullet = new Bullet(this.x+15, this.y+15, this.angle, 2);
        arrProjectiles.push(bullet);
    }
    /*
    shoot() {
       bullet = new Bullet(this.x + 15, this.y, this.angle, 1.5);
    }
    */
}

class Bullet {
    constructor(x, y, angle, speed) {
        this.x = x
        this.y = y
        this.angle = angle
        this.speed = speed
    } 

    render() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, true);
        ctx.fill();

        this.x += this.speed * Math.cos(this.angle);
        this.y += +1 * this.speed * Math.sin(this.angle);
    }

}


document.addEventListener('DOMContentLoaded', function() {
    triangle = new Triangle(100, 200, '#228B22', 21);
    turret = new Turret(600, 200, Math.PI*1.75);
    arrTriangles.push(triangle);
    turret.shoot();
    document.addEventListener('keydown', function(evt) {
        if (evt.key === 'b') {
          turret.shoot();
        }
    })
    const runGame = setInterval(gameLoop, 20);
  })


  function gameLoop() {
    // Clear the Cavas
    ctx.clearRect(0, 0, game.width, game.height);
    arrProjectiles.forEach(element => element.render());
    arrTriangles.forEach(element => element.render());
    turret.render();
}

function drawBox(x, y, size, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

function detectHit() {
    for (let i = 0; i < arrProjectiles.length; i++) {

    }
};