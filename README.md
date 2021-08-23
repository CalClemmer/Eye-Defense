# ProjectOneGame
==========================================================

SEI 802 Project 1: Eye Defense

A simple tower defense game built by Cal Clemmer

To play Eye Defense online, visit https://calclemmer.github.io/ProjectOneGame/

# How to Play 
==========================================================

The Eyes are attacking! If an Eye makes it to the right side of the screen, it's game over. Click on the screen to place towers to fight off the monsters! Place the towers wisely, it costs $100 to place a tower. Even worse, if an eye touches a tower it'll destroy the tower. Kill Eyes to get more money, build towers to protect yourself, and keep the ever growing hoards of Eyes at bay.  
  
Press to Pause/Unpause 

Kill 2000 Eyes to Win! 

# How to Install 
==========================================================
1. <code>Fork</code> and <code>Clone</code> this repository to your local machine 
2. Open index.html in a browser to play 

# Some Code Snippets
==========================================================

1.  <b>Aiming the Turret</b><br>
This method on the turret class finds the closest enemy, then calculates the angle between the turret and that enemy. This calculated angle is set as the "aimAngle"<br>
    ```javascript
    aim() {
        let closestEnemy = findClosest(this.x, this.y, arrTriangles);

    // magic to find angle 

        if (closestEnemy !== undefined) {
        this.aimAngle = Math.atan2(closestEnemy[1] - (this.y+15), closestEnemy[0] - (this.x+15));
        } else {
            this.aimAngle = Math.PI;
        }

        // this code lets it complete the circle! Otherwise turret will never cross the Pi rad (180 degree) angle, and spin the other way around instead even when that path is far longer
        // Essentially we're trying to keep the angle between 0 and 2PI rad

        if ((this.aimAngle + 2*Math.PI - this.angle) < Math.PI) {
            this.aimAngle += 2*Math.PI;
        } else if ((this.aimAngle - 2*Math.PI + this.angle) > Math.PI) {
            this.aimAngle -= 2*Math.PI;
        }
    }
    ```

 This code, part of the render class on the turret, and adjusts the angle of the turret barrel to match up with the aim angle. It has a course aim that quickly moves the turret barrel and a fine aim that more precisely lines up the barrel. 

```javascript 
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
```

2. <b>Despawning Off Screen Projectiles</b><br>
If projectiles could continue off the screen forever, the game would quickly come to a laggy stop. To prevent this, this simple function checks if a given object is off screen, and despawns it if it is.  
  
```javascript 
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
```
3. 