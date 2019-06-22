function randomIntFromInterval(min,max){ //min max may be included
    return Math.floor(Math.random()*(max-min+1)+min);
}
/** Attractor **/
function Attractor(weaksignal, xCord, yCord) {
    this.ws = weaksignal;
    var length = width - 2*padding;
    var interval = (length / grid);
    var centerX = padding + interval * (xCord+1);
    centerX = centerX - interval/2;
    length = height - 2*padding;
    interval = (length / grid);
    var centerY = padding + interval * (yCord+1);
    centerY = centerY - interval/2;

    this.pos = createVector(centerX, centerY);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);

    this.mass = 6;
    this.G = 20; //was 80
    this.scaler = 5;

    this.calculateAttraction = function(p){
        //calculate direction of force
        var force = p5.Vector.sub(this.pos, p.pos);



        push();
        var opa = noise(p.offset) * 255;
        // console.log(opa);

        stroke(color(50,50,50,opa));
        // stroke(255);
        line(this.pos.x, this.pos.y, p.pos.x, p.pos.y);
        pop();

        //distance between objects
        var distance = force.mag();

        //limit vector to eliminate extreme values at very close or very far
        // distance = constrain(distance,20,25);
        distance = constrain(distance,50,55);
        //Not really important but is what it is to get direction
        force.normalize();

        //calculate gravitational from magniitude
        var strength = (this.G * this.mass * p.mass) / (distance * distance);

        //get force vector --> magnitude * direction
        force.mult(strength);
        //var force;
        return force;
    }

    this.applyForce = function(force){
        // A = F /M
        var f = force.copy();
        f.div(this.mass);
        this.acc.add(f);
    }

    this.update = function(){
        this.edges();
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0,0);
    }

    this.display = function(){
        push();
        // fill(30,25,20);
        stroke(30,25,30);
        // ellipse(this.pos.x, this.pos.y, this.mass * this.scaler, this.mass * this.scaler);
        // fill(30,25,20);
        textAlign(CENTER, CENTER);
        // text(this.ws, this.pos.x, this.pos.y);
        pop();
    }

    this.edges = function(){
        if (this.pos.y > height) {
            this.vel.y *= -1;
            this.pos = createVector(width/2, height/2);
            this.vel = createVector(0,0);
        }
        if (this.pos.x > width) {
            this.vel.x *= -1;
            this.pos = createVector(width/2, height/2);
            this.vel = createVector(0,0);
        }
        if (this.pos.x < 0) {
            this.vel.x *= -1;
            this.pos = createVector(width/2, height/2);
            this.vel = createVector(0,0);
        }
        if (this.pos.y < 0) {
            this.vel.x *= -1;
            this.pos = createVector(width/2, height/2);
            this.vel = createVector(0,0);
        }
    }

}
/** Particle **/
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
/** Sketch**/
var particles = [];
var limit = 10;
var weaksignals = [];
var keywords = [];
var attractors = [];
var jsonData = {};
var padding = 100;
var grid = 4;


function preload() {
    var jsonFile = "../data/fromspreadsheet-16.json";
    jsonData = loadJSON(jsonFile);
    console.log(jsonData);
}

var cnv;


var atlasObj = function(weaksignal, keyword){
    this.kw = keyword;
    this.ws = weaksignal;
};

function centerCanvas() {
    cnv = createCanvas(windowWidth, windowHeight);
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
}

function windowResized() {
    centerCanvas();
}

function setup() {
    centerCanvas();
    setupWeakSignals();
    textFont("Overpass Mono");
    frameRate(60);
    setupObjects();
}

function draw() {
    background('#000');
    clear();


    for (var i = 0; i < particles.length; i++) {
        particles[i].applyGravity();
        // particles[i].separate(particles);
        // particles[i].separate(attractors);
        particles[i].update();
        particles[i].display();
    }

    textSize(14);
    fill(0);
    attractors.forEach(function(a){
        a.update();
        a.display();
    });
}

function setupObjects(){
    weaksignals.forEach(function(ws, i){
        keywords[i].forEach(function(kw, j){
            var atls = new atlasObj(ws, kw);
            console.log(atls);
            particles.push(new Particle(random(50, width - 50), random(50, height - 50), {ws:ws, kw:kw}));
        });
    })
}

function setupWeakSignals(){

    //clipping keyword list to random selected words until wordCount reached
    for (var i in jsonData){
        var wordCount = 5;
        var items, index, item;
        if (jsonData[i]["keywords"].length > wordCount) {
            var newItems = [];
            for (var j = 0; j < wordCount; j++) {
                items = jsonData[i]["keywords"];
                index = Math.floor(Math.random() * items.length);
                item = items.splice(index, 1);
                newItems.push(item[0]);
                // console.log(item[0]);
            }
            console.log(newItems);
            jsonData[i]["keywords"] = newItems.slice();
        }
    }
    // console.log(jsonData);


    // console.log('setup');
    // console.log(jsonData);

    var j = 0, k = 0;
    for (var i in jsonData){
        console.log(j,k);
        attractors.push(new Attractor(jsonData[i]["name"], j, k));
        weaksignals.push(jsonData[i]["name"]);
        keywords.push(jsonData[i]["keywords"]);
        console.log('hit');
        $((".s" + j)+k).html("<h1>"+jsonData[i]["name"] +"</h1>");
        if (j == (grid-1)){
            k++;
            j = -1;
        }
        j++;
    }

    // console.log(weaksignals)
    // 3 * 3 grid
}

function reInit(){
    particles.splice(0,particles.length);
    weaksignals.splice(0,weaksignals.length);
    keywords.splice(0,keywords.length);
    attractors.splice(0,attractors.length);

    setupWeakSignals();
    setupObjects();
}


setInterval(function(){
    reInit();
}, 60000 * 5);