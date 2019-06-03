var particles = [];
var limit = 10;
var imgs = [];

var weaksignals = [];
var keywords = [];

var attractors = [];

function preload() {
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

    // for (var i = 0; i < limit; i++) {
    //     var imgLoc = (floor(random(1, imgs.length)) - 1);
    //     var img = imgs[i];
    //     particles.push(new Particle(random(50, width - 50), random(50, height - 50), img));
    // }

    weaksignals.forEach(function(ws, i){
        keywords[0].forEach(function(kw, i){
            var atls = new atlasObj(ws, kw);
            console.log(atls);
            particles.push(new Particle(random(50, width - 50), random(50, height - 50), {ws:ws, kw:kw}));
        });
    })
}

function draw() {
    background('#000');

    for (var i = 0; i < particles.length; i++) {
        particles[i].applyGravity();
        // particles[i].separate(particles);
        // particles[i].separate(attractors);
        particles[i].update();
        particles[i].display();
    }

    fill(100);
    textSize(32);
    // text("   The Future Is Now", mouseX, mouseY, 600, 200);


    // weaksignals.forEach(function(ws){
    //     ellipse(width/2, height/2, 200, 200);
        fill(255);
    //     text(ws, width/2, height/2, 200, 200); // todo -- create with box and align to center of that box
    // });

    attractors.forEach(function(a){
        a.update();
        a.display();
    });
}

console.log('hello'+'world'.repeat(3));

function setupWeakSignals(){
    // load from file...
    // into array
    console.log('setup');

    weaksignals.push("AI Bias");

    attractors.push(new Attractor("AI Bias"));

    keywords.push(["exclusion","data set", "ai ethics", "manipulation"]);
}