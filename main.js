// ==================GLOBAL VARIABLES=================
let messageDisplay = document.getElementById('messageDisplay')
let game = document.getElementById('game')
let buildSelect = '';
let globalCount = 0;
let score = 0;
let money = 600;
let p = true;
let lost = false;
let won = false;
const ctx = game.getContext('2d');
let eyeball = new Image();
eyeball.src = 'Eyeball.png';
let winPause = 0;

const arrProjectiles = [];
const arrTriangles = [];
const arrTurrets = [];
const arrSpinners = [];

game.setAttribute('class', 'main-game')
game.setAttribute("height", getComputedStyle(game)["height"]);
game.setAttribute("width", getComputedStyle(game)["width"]);

// ======================CLASSES==========================


// const arrSquares = [];

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
        ctx.drawImage(eyeball, this.x - 10, this.y - 20, 42, 42);
        this.x += this.speed;
    }
}

class Spinner {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.angle = Math.PI;
        this.cooldownCount = 0;
        this.count = 0; 
        this.spinSpeed = 0.03;
        this.cooldown = false;
    }

    render() {
    // draw bottom circle
        this.count++;
        ctx.beginPath();
        ctx.fillStyle = "gray";
        ctx.arc(this.x, this.y, 12, 0, Math.PI * 2, true);
        ctx.fill();

    // draw spinner 
        ctx.fillStyle = 'brown';
        ctx.save();
        ctx.translate( this.x, this.y);
        ctx.rotate(this.angle - Math.PI/2);
        ctx.fillRect(-3, -23, 6, 46);
        ctx.restore();
    // draw top circle 
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI * 2, true);
        ctx.fillStyle = "orange";
        ctx.fill();

        this.angle += this.spinSpeed;

    // should speed up, fire, then slow down
        if (this.cooldownCount === 0) {
            this.spinUp();
            this.cooldown = false;
        } else if (this.cooldown === false &&  this.cooldownCount < 300) {
            this.spinSpeed += 0.0015;
            this.shoot();
            this.cooldownCount += 6;
        } else {
            if (this.spinSpeed > 0.03) {
            this.spinSpeed -= 0.0006
        }
            this.cooldown = true;
            this.cooldownCount--;
        }

    }

    spinUp() {
        if ((findClosest(this.x, this.y, arrTriangles, 'distance')) < 120) {
            this.spinSpeed += 0.002;
        } else if (this.spinSpeed > 0.03) {
            this.spinSpeed -= 0.002;
        }

        if (this.spinSpeed > 0.12) {
            this.cooldownCount = 30;
        }
    }

    shoot() {
        if (this.count % 2 === 0) {
        const bullet = new Bullet(this.x, this.y, this.angle, 2, 2, 80);
        arrProjectiles.push(bullet);
        const bullet2 = new Bullet(this.x, this.y, this.angle + Math.PI, 2, 2, 80);
        arrProjectiles.push(bullet2);
        }
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
        const bullet = new Bullet(this.x+15, this.y+15, this.angle, 2, 3, 800); 
        arrProjectiles.push(bullet);
    };
}

class Bullet {
    constructor(x, y, angle, speed, size, range) {
        this.x = x
        this.y = y
        this.angle = angle
        this.speed = speed
        this.size = size;
        this.range = range;
        this.count = 0;
    } 

    render() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
        ctx.fill();

        this.x += this.speed * Math.cos(this.angle);
        this.y += +1 * this.speed * Math.sin(this.angle);
        this.count++;
    }

}

// ======================EVENT LISTENERS=======================
document.addEventListener('DOMContentLoaded', function() {

// =====================Create Thing at Click====================
game.addEventListener("click", function(e) {
    if (lost === false && winPause < globalCount) {
        p = false;
        messageDisplay.innerText = 'Click to Place Towers!'
        document.getElementById('secondMessage').innerText = 'Kill 2000 Eyes to Win!'
    }
// Making sure I can't spawn it off screen
    if (e.offsetX - 15 > 10 && e.offsetY - 15 > 10 && e.offsetX - 15 < 840 && e.offsetY - 15 < 400 && 
        (findClosest(e.offsetX - 15, e.offsetY - 15, arrTurrets, 'distance') > 35 || arrTurrets.length === 0)) {

        if (money >= 100 && p === false) {
        const turret = new Turret(e.offsetX - 15, e.offsetY - 15)
        arrTurrets.push(turret);
        money -= 100;
        document.getElementById('money').innerText = 'Money: ' + money;

        } 
    }
})

// Pause! :D 
document.addEventListener('keydown', function(evt) {
    if (evt.key === 'p' && lost === false) {
      if (p === false) {
          p = true;
        } else {
            p = false;
        }
    }
})

    // this should be 20ms
    const globalCount = setInterval(globalCounter, 20)
    const runGame = setInterval(gameLoop, 20);
  })


//============================CORE GAME LOOP=============================

  function globalCounter() {
      globalCount++;
  }
  function gameLoop() {
    if (p === false) {
    // Clear the Cavas
    ctx.clearRect(0, 0, game.width, game.height);
    despawn(arrTriangles);
    despawn(arrProjectiles);
    //despawn(arrSquares);
    spawnRandomTriangles(0.8*(64.8 + (-8.77*Math.log(score))));   //old calc (100 - 4*Math.sqrt(score));
    arrProjectiles.forEach(element => element.render());
    arrTriangles.forEach(element => element.render());
    arrTurrets.forEach(element => element.render());
    detectBulletHit(arrTriangles);
    detectTurretHit();
    bulletRange();
    checkLose(arrTriangles);
    checkWin(arrTriangles);
    //triangle.render();
    }
}

//===============================FUNCTIONS==============================

function drawBox(x, y, size, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

function detectBulletHit(arr) {
    // triangle collision. Right now they have square collision boxes but that's good enough for now.
    if (arrProjectiles.length > 0 && arr.length > 0)
    for (let i = 0; i < arrProjectiles.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (arrProjectiles[i] && arr[j].x) {
            if (arrProjectiles[i].x < arr[j].x + arr[j].length &&
                arrProjectiles[i].x > arr[j].x &&
                arrProjectiles[i].y > arr[j].y - 18 &&
                arrProjectiles[i].y < arr[j].y + 2
                ) 
                {
                    arrProjectiles.splice(i, 1);
                    arr.splice(j, 1);
                    score += 1;
                    money += 2;
                    document.getElementById('score').innerText = 'Score: ' + score;
                    document.getElementById('money').innerText = 'Money: ' + money;
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
    if (frequency > 100) {
        frequency = 100;
    }
    if (frequency < 1) {
        frequency = 1;
    } else {
        frequency = Math.round(frequency);
    }

    let distanceLimit = 29;
    if (frequency <= 2) {
        distanceLimit = 23;
    }

    
    if (globalCount % 100 === 0) {
        console.log(frequency);
    }

    if (globalCount % frequency === 0) {
        let escape = 0;
        const triangle = new Triangle(-25, Math.random()*400 + 20, '#228B22', 21, 1);

        
        while (escape < 10) {
            if (findClosest(triangle.x + 11, triangle.y + 9, arrTriangles, 'distance') > distanceLimit || arrTriangles.length === 0) {
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
    // distance * speed 
    // I'm still slightly off but not sure how, it's definitely an improvement though 
        if (closest[3] !== 0) {
            if (closest[0] < x) {
                closest[0] += (closest[2] * closest[3] / (2.6)) //(2.8)); // magic correction
            } else {
                closest[0] += (closest[2] * closest[3] / (1))
            }
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
            arr[i].x < -50 || arr[i].x > 950 
            ||
            arr[i].y < -50 || arr[i].y > 460
        ) {
            arr.splice(i, 1);
            i--;
        }
    }
}

function checkLose(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].x > 920) {
            lost = true;
            p = true;
            ctx.fillStyle = 'red'
            ctx.font = "120px Arial"
            ctx.fillText("GAME OVER", 80, 250)        
            ctx.strokeStyle = 'black'
            ctx.lineWidth = '3' 
            ctx.strokeText("GAME OVER", 80, 250)
            
            // if i ever add a restart function this will revived 
            //ctx.fillText("Press Enter to Restart", 325, 280)
            // Add reset function 
        }
    }
}

function checkWin(arr) {
    if (score >= 2000 && won === false) {
        ctx.fillStyle = 'goldenrod'
        ctx.font = "120px Arial"
        ctx.fillText("YOU WIN!", 160, 240)
        ctx.strokeStyle = 'black'
        ctx.lineWidth = '3' 
        ctx.strokeText("YOU WIN!", 160, 240)
        ctx.font = "50px Arial"
        ctx.fillText("Press P to Unpause", 220, 300)
        ctx.lineWidth = '2'
        ctx.strokeText("Press P to Unpause", 220, 300)
        p = true;
        won = true;
        winPause = globalCount + 200;
        }
    }

function bulletRange() {
    for (let i = 0; i < arrProjectiles.length; i++) {
        if (arrProjectiles[i].count > arrProjectiles[i].range) {
            arrProjectiles.splice(i, 1);
            i--;
        }
    }
}

