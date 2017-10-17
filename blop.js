const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    simplex = new SimplexNoise();


let particles = [],
    lastCoords,
    time = 0;




function Particle(angle, radius){

    this.angle = angle;
    this.radius = radius;
    this.amplitude = 60;

    this.baseX = canvas.width / 2;
    this.baseY = canvas.height / 2;

    this.noise = simplex.noise2D(Math.cos(this.angle), Math.sin(this.angle)) * this.amplitude;

    this.x = this.baseX + Math.cos(this.angle) * ( this.radius + this.noise);
    this.y = this. baseY + Math.sin(this.angle) * ( this.radius + this.noise);



}


Particle.prototype = {

    render : function() {
        ctx.beginPath();
        ctx.save();

        ctx.fillStyle = 'white';

        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);

        ctx.fill();

        if (!lastCoords) {
            lastCoords = {
                x : this.x,
                y : this.y
            };
        }

        ctx.strokeStyle = "white";
        ctx.moveTo(lastCoords.x, lastCoords.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();


        lastCoords = {
            x : this.x,
            y : this.y
        };


        ctx.restore();
        ctx.closePath();

    },

    update : function () {
        time += 0.00005;
        this.noise = simplex.noise2D(Math.cos(this.angle) + time , Math.sin(this.angle) + time) * this.amplitude;
        this.x = this.baseX + Math.cos(this.angle) * ( this.radius + this.noise);
        this.y = this. baseY + Math.sin(this.angle) * ( this.radius + this.noise);
    }

};


function updateFrame(){
    requestAnimationFrame(updateFrame);
    ctx.clearRect(0,0, canvas.width, canvas.height);

    lastCoords = [];
    for(let i = 0; i < particles.length; i++) {
        let particle = particles[i];

        particle.update();
        particle.render();

    }

    drawLastToFirst();
}




function init() {


   for(let i = 0; i < Math.PI * 2; i+= 0.15 ) {
       let angle = i;

       let particle = new Particle(angle, 250);
       particles.push(particle);
       particle.render();
   }

   drawLastToFirst();

   updateFrame();
}

function drawLastToFirst() {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.moveTo(particles[particles.length - 1].x, particles[particles.length - 1].y);
    ctx.lineTo(particles[0].x, particles[0].y);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();
}

init();

