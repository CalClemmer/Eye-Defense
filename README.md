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

1. <b>Aiming the Turret</b><br>
This method on the turret class finds the closest enemy, then calculates the angle between the turret and that enemy. <br>
    ```javascript
    aim() {
        let closestEnemy = findClosest(this.x, this.y, arrTriangles);

    // magic to find angle 

        if (closestEnemy !== undefined) {
        this.aimAngle = Math.atan2(closestEnemy[1] - (this.y+15), closestEnemy[0] - (this.x+15));
        } else {
            this.aimAngle = Math.PI;
        }

        // this code lets it complete the circle! Otherwise 

        if ((this.aimAngle + 2*Math.PI - this.angle) < Math.PI) {
            this.aimAngle += 2*Math.PI;
        } else if ((this.aimAngle - 2*Math.PI + this.angle) > Math.PI) {
            this.aimAngle -= 2*Math.PI;
        }
    }
    ```