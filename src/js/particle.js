function Particle(x,y,a){
    this.atlas = a;

    this.offset = randomIntFromInterval(0,100)/100;



    this.pos = createVector(x, y);
    this.vel = createVector(random(-3,3),random(-3,3));
    this.acc = createVector(0,-8);

    // this.vel = createVector(0,0);
    // this.acc = createVector(0,0);

    this.mass = 10;
    this.G = 5;
    this.previousVel = createVector(0,0);
    this.maxSpeed = 3;

    this.theta = 0.0;
    this.size = 20;
    // this.maxForce = 1;

    this.history = [];


    this.update = function(){
        this.offset += 0.1;
        // console.log(this.offset);
        this.edges();
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0,0);


        if (frameCount % 10 == 1){
            var v = createVector(this.pos.x, this.pos.y);
            this.history.push(v);
            if (this.history.length > 8){
                this.history.splice(0,1);
            }
            // console.log(this.pos);
            // console.log("current ^ last v");
            // console.log(this.history);
        }
    }

    this.display = function(){
        this.trailing();
        var theta = this.vel.heading() + radians(90);
        this.theta += (this.vel.x * this.vel.mag()) / 20;
        var r = 4;
        push();
        translate(this.pos.x, this.pos.y);
        // rotate(this.theta);
        textAlign(CENTER, CENTER);
        textSize(12);
        stroke(255);
        fill(225);
        text(this.atlas.kw, 0,0);
        pop();
    }

    this.trailing = function(){
        for (var i = 0; i < this.history.length; i++){
            var pos = this.history[i];
            push();
            translate(pos.x, pos.y);
            stroke('#f2dd1c');
            fill(225);

            point(0,0);
            pop();
        }
    }

    this.edges = function(){
        if (this.pos.x < -this.size) this.pos.x = width+this.size;
        if (this.pos.y < -this.size) this.pos.y = height+this.size;
        if (this.pos.x > width+this.size) this.pos.x = -this.size;
        if (this.pos.y > height+this.size) this.pos.y = -this.size;
    }

    this.separate = function(vehicles) {
        var desiredseparation = this.size*1.1;
        var sum = createVector();
        var count = 0;
        for (var i = 0; i < vehicles.length; i++) {
            var d = p5.Vector.dist(this.pos, vehicles[i].pos);
            if ((d > 0) && (d < desiredseparation)) {
                var diff = p5.Vector.sub(this.pos, vehicles[i].pos);
                diff.normalize();
                diff.div(d);
                sum.add(diff);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxSpeed * 2);
            var steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }

    this.applyForce = function(force) {
        var f = force.copy();
        f.div(this.mass);
        this.acc.add(f);
    }

    //calculate attraction
    this.calculateAttraction = function(obj){
        //calculate direction of force
        var force = p5.Vector.sub(this.pos, obj.pos);

        //distance between objects
        var distance = force.mag();
        //limit vector to eliminate extreme values at very close or very far
        //distance = constrain(distance,20,25);
        //Not really important but is what it is to get direction
        force.normalize();

        //calculate gravitational from magniitude
        var strength = (this.G * this.mass * obj.mass) / (distance * distance);

        //get force vector --> magnitude * direction
        force.mult(strength);
        //var force;
        return force;
    }

    this.applyGravity = function(){
        for (var i = 0; i < attractors.length; i++){
            var a = attractors[i];
            if (a.ws === this.atlas.ws){ //get everyone applied to and attract to it
                // console.log('attracted to: ' + a.ws);
                var f = a.calculateAttraction(this);
                // console.log(f);
                this.applyForce(f);
            }
        }
    }

}
