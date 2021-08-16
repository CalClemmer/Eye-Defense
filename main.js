//
let movementDisplay = document.getElementById('buildMenu')
let game = document.getElementById('game')
let buildSelect = '';
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
        this.speed = speed
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
    
        this.x += this.speed;
    }
}


class Turret {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.angle = Math.PI;
        this.aimAngle = undefined;
        this.aimCount = 0;
    }

    render() {
        this.aimCount += 1;

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

        if (this.aimCount % 10 === 0) {
            this.aim();
        } 

        if (this.aimCount % 70 === 0 && arrTriangles.length > 0) {
            this.shoot();
        }

  

        
        // course aim 
        if (this.angle + 0.04 < this.aimAngle) {
            this.angle += 0.04;
        } else if (this.angle - 0.04 > this.aimAngle) {
            this.angle -= 0.04;

        // fine aim 
        } else if (this.angle + 0.004 < this.aimAngle) {
            this.angle += 0.004;
        } else if (this.angle - 0.004 < this.aimAngle) {
            this.angle += 0.004;
        }

        /*
        if (this.aimAngle - this.angle < 0.1) {
            this.angle -= 0.02;
        }
        */
    }

    aim() {
        let closestEnemy = findClosestEnemy(this.x, this.y, 30);

        if (closestEnemy !== undefined) {
        this.aimAngle = Math.atan2(closestEnemy[1] - (this.y+15), closestEnemy[0] - (this.x+15));
        } else {
            this.aimAngle = Math.PI;
        }

        // this code lets it complete the circle! 
        if ((this.aimAngle + 2*Math.PI - this.angle) < Math.PI) {
        this.aimAngle += 2*Math.PI;
        }
    }

    shoot() {
        console.log('Bang');
        const bullet = new Bullet(this.x+15, this.y+15, this.angle, 2);
        arrProjectiles.push(bullet);
    }
;
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
    triangle = new Triangle(100, 200, '#228B22', 21, 1);
    turret = new Turret(600, 200, Math.PI*0.5);
    arrTriangles.push(triangle);
    turret.shoot();
    spawn5Triangles(0, 200);

// ==========================DEBUGGING===========================

// Create Bullet at Click
/*
    game.addEventListener("click", function(e) {
        const bullet = new Bullet(e.offsetX, e.offsetY, 0, 0);
        arrProjectiles.push(bullet);
        console.log(arrProjectiles[arrProjectiles.length - 1].y);
        console.log(arrProjectiles[arrProjectiles.length - 1].x)
    })
*/

// Create Thing at Click
game.addEventListener("click", function(e) {
    if (buildSelect = 'triangle') {
        const triangle = new Triangle(e.offsetX, e.offsetY, '#228B22', 21, 0);
        arrTriangles.push(triangle);
        console.log(arrTriangles[arrTriangles.length - 1].y);
        console.log(arrTriangles[arrTriangles.length - 1].x)
    }
    if (buildSelect = 'turret') {
        const turret = new Turret(e.offsetX, e.offsetY, Math)
    }
})
// Fire Gun on B
    document.addEventListener('keydown', function(evt) {
        if (evt.key === 'b') {
          turret.shoot();
        }
    })

// Aim Turret on F
    document.addEventListener('keydown', function(evt) {
        if (evt.key === 'f') {
        turret.aim();
        console.log('aimAngle, angle', turret.aimAngle, turret.angle);
        }
    })
    // this should be 20ms
    const runGame = setInterval(gameLoop, 20);
  })


  function gameLoop() {
    // Clear the Cavas
    ctx.clearRect(0, 0, game.width, game.height);
    despawn(arrTriangles);
    despawn(arrProjectiles);
    arrProjectiles.forEach(element => element.render());
    arrTriangles.forEach(element => element.render());
    turret.render();
    detectHit();
    //triangle.render();
}

function drawBox(x, y, size, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

function detectHit() {
    // triangle collision. Right now they have square collision boxes but that's good enough for now.
    if (arrProjectiles.length > 0 && arrTriangles.length > 0)
    for (let i = 0; i < arrProjectiles.length; i++) {
        for (let j = 0; j < arrTriangles.length; j++) {
            if (arrProjectiles[i] && arrTriangles[j].x) {
            if (arrProjectiles[i].x < arrTriangles[j].x + arrTriangles[j].length &&
                arrProjectiles[i].x > arrTriangles[j].x &&
                arrProjectiles[i].y > arrTriangles[j].y - 18 &&
                arrProjectiles[i].y < arrTriangles[j].y + 2
                ) 
                {
                    arrProjectiles.splice(i, 1);
                    arrTriangles.splice(j, 1);
                }
            }
        }
    }
};

function spawn5Triangles(x, y) {
    for (let i = 0; i < 5; i++) {
    const triangle = new Triangle(x, y - 100 + (50*i), '#228B22', 21, 1);
    arrTriangles.push(triangle);
    }
}
/*
function spawnTestTriangle(x, y) {
    for (let i = 0; i < 5; i++) {
    const triangle = new Triangle(x, y - 100 + (50*i), '#228B22', 21, 0);
    arrTriangles.push(triangle);
    }
}
*/
function findClosestEnemy(x, y, width) {
    //x = x + width/2;
    //y = y + width/2;
    let closestEnemy = [x, y, 10000]; // x, y, and distance

    // Make sure there are actually enemies 
    if (arrTriangles.length === 0 ) {
        return undefined
    }

    // Simple pythagorean theorem for distance 
    for (let i = 0; i < arrTriangles.length; i++) {
        let distance = ((arrTriangles[i].x - x) ** 2 + (arrTriangles[i].y - y) ** 2) ** 0.5;
        if (distance < closestEnemy[2]) {
            closestEnemy = [arrTriangles[i].x, arrTriangles[i].y, distance]
        }
    }
    // hacky fix to aim for center...
    closestEnemy[0] += 10.5;
    closestEnemy[1] -= 2;
    return closestEnemy; 
}

// Gets ride of offscreen items;
function despawn(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (
            arr[i].x < -10 || arr[i].x > 900 
            ||
            arr[i].y < -10 || arr[i].y > 460
        ) {
            arr.splice(i, 1);
            i--;
            console.log('Cut')
        }
    }
}