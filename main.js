//
let movementDisplay = document.getElementById('buildMenu')
let game = document.getElementById('game')
const ctx = game.getContext('2d');

game.setAttribute('class', 'main-game')
game.setAttribute("height", getComputedStyle(game)["height"]);
game.setAttribute("width", getComputedStyle(game)["width"]);

// ======================ENTITIES==========================

class Triangle {
    constructor(x, y, color, length) {
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
    }
}

class Turret {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.angle = 0;
    }

    render() {
        let width = 30;
        let height = 30;
        let rotationAngle = Math.PI/.8;
        let turretCenter = [4, 0]
        //draw bottom rectangle 
        ctx.fillStyle = '#CCC'; 
        ctx.fillRect(this.x, this.y, width, height);
        ctx.beginPath();

        //draw middle rectangle 
        ctx.fillStyle = 'yellow';
        
        ctx.save();

        ctx.translate( this.x + width/2, this.y + height/2);
        ctx.rotate(rotationAngle);
        ctx.fillRect(-turretCenter[0], -turretCenter[1], 8, 30);


        ctx.restore();


        //draw top circle 
        ctx.fillStyle = "red";
        ctx.arc(this.x + 15, this.y + 15, 13, 0, Math.PI * 2, true);
        ctx.fill();
        
    }
}

document.addEventListener('DOMContentLoaded', function() {
    triangle = new Triangle(100, 200, '#228B22', 21);
    ogre = new Triangle(500, 150, '#228B22', 30);
    turret = new Turret(200, 100);
    const runGame = setInterval(gameLoop, 40);
  
  })

  function gameLoop() {
    // Clear the Cavas
    ctx.clearRect(0, 0, game.width, game.height);

    turret.render();
    triangle.render();
    

    // Check of the ogre is alive
    if (ogre.alive) {
        ogre.render();
        // TODO: detectHit
    }
}

function drawBox(x, y, size, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

