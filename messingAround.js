//
let movementDisplay = document.getElementById('buildMenu')
let game = document.getElementById('game')
let buildSelect = '';
let globalCount = 0;
let score = 0;
const ctx = game.getContext('2d');

game.setAttribute('class', 'main-game')
game.setAttribute("height", getComputedStyle(game)["height"]);
game.setAttribute("width", getComputedStyle(game)["width"]);

// ======================ENTITIES==========================

const arrProjectiles = [];
const arrTriangles = [];
const arrTurrets = [];

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
    }

    aim() {
        let closestEnemy = findClosest(this.x, this.y, arrTriangles);

    // magic to find angle 

        if (closestEnemy !== undefined) {
        this.aimAngle = Math.atan2(closestEnemy[1] - (this.y+15), closestEnemy[0] - (this.x+15));
        } else {
            this.aimAngle = Math.PI;
        }

        // this code lets it complete the circle! ..and I think I ironed out the issues 
        if ((this.aimAngle + 2*Math.PI - this.angle) < Math.PI) {
            this.aimAngle += 2*Math.PI;
        } else if ((this.aimAngle - 2*Math.PI + this.angle) > Math.PI) {
            this.aimAngle -= 2*Math.PI;
        }
    }

    shoot() {
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
    arrTurrets.push(turret);
    // spawn5Triangles(0, 200);

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
    if (buildSelect === 'triangle') {
        const triangle = new Triangle(e.offsetX, e.offsetY, '#228B22', 21, 1);
        arrTriangles.push(triangle);
        console.log(arrTriangles[arrTriangles.length - 1].y);
        console.log(arrTriangles[arrTriangles.length - 1].x)
    }
    if (buildSelect === 'turret') {
        if (findClosest(e.offsetX - 15, e.offsetY - 15, arrTurrets, 'distance') > 35) {
            const turret = new Turret(e.offsetX - 15, e.offsetY - 15)
            arrTurrets.push(turret);
        } else {
            console.log(findClosest(e.offsetX - 15, e.offsetY - 15, arrTurrets, 'distance'))
        }
    }
})

document.addEventListener('keydown', function(evt) {
    if (evt.key === 't') {
      if (buildSelect === 'triangle') {
          buildSelect = 'turret';
      } else {
          buildSelect = 'triangle';
      }
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
    globalCount++;
    spawnRandomTriangles(3);
    arrProjectiles.forEach(element => element.render());
    arrTriangles.forEach(element => element.render());
    arrTurrets.forEach(element => element.render());
    detectHit();
    detectTurretHit();
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
                    score += 1;
                    document.getElementById('score').innerText = score;
                }
            }
        }
    }
};

function detectTurretHit() {
    if (arrTurrets.length > 0 && arrTriangles.length > 0)
    for (let i = 0; i < arrTurrets.length; i++) {
        for (let j = 0; j < arrTriangles.length; j++) {
            if (arrTurrets[i] && arrTriangles[j].x) {
            if (arrTurrets[i].x < arrTriangles[j].x + arrTriangles[j].length &&
                arrTurrets[i].x + 30 > arrTriangles[j].x &&
                arrTurrets[i].y + 30 > arrTriangles[j].y - 18 &&
                arrTurrets[i].y < arrTriangles[j].y + 2
                ) 
                {
                    arrTurrets.splice(i, 1);
                    arrTriangles.splice(j, 1);
                }
            }
        }
    }
}

function spawnRandomTriangles(frequency) {
    if (globalCount % frequency === 0) {
        let escape = 0;
        const triangle = new Triangle(-25, Math.random()*400 + 20, '#228B22', 21, 1);
        while (escape < 10) {
            if (findClosest(triangle.x + 11, triangle.y + 9, arrTriangles, 'distance') > 28) {
                escape = 10;
                arrTriangles.push(triangle);
            } else {
                triangle.y = Math.random()*400 + 20;
                escape ++;
            }
            
        }
    
    }
}


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
function findClosest(x, y, arr, value) {
    //x = x + width/2;
    //y = y + width/2;
    let closest = [x, y, 10000]; // x, y, and distance

    // Make sure there are actually enemies 
    if (arr.length === 0 ) {
        return undefined
    }

    // Simple pythagorean theorem for distance 
    for (let i = 0; i < arr.length; i++) {
        let distance = ((arr[i].x - x) ** 2 + (arr[i].y - y) ** 2) ** 0.5;
        if (distance < closest[2]) {
            closest = [arr[i].x, arr[i].y, distance, arr[i].speed]
        }
    }

    //some triangle specific code 
    if (arr === arrTriangles) {
        // hacky fix to aim for center...
        closest[0] += 10.5;
        closest[1] -= 2;
    // let's try to lead the enemy
    // distance * speed / bullet speed 
    // I'm still slightly off but not sure how, it's definitely an improvement though 
        if (closest[3] !== 0) {
            closest[0] += (closest[2] * closest[3] / 2);
        }
    }
    if (value === 'distance') {
        return closest[2]; 
    } else {
        return closest;
    }
}


// Gets ride of offscreen items;
function despawn(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (
            arr[i].x < -50 || arr[i].x > 900 
            ||
            arr[i].y < -50 || arr[i].y > 460
        ) {
            arr.splice(i, 1);
            i--;
        }
    }
}