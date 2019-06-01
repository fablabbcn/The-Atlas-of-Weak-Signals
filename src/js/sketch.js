var particles = [];
var limit = 11;
var imgs = [];

var gif;

function preload() {

}

var cnv;

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
    for (var i = 0; i < limit; i++) {
        var imgLoc = (floor(random(1, imgs.length)) - 1);
        var img = imgs[i];
        particles.push(new Particle(random(50, width - 50), random(50, height - 50), img));
    }
    textFont("Overpass Mono");
}

function draw() {
    background('#000');

    for (var i = 0; i < limit; i++) {
        particles[i].separate(particles)
        particles[i].update();
        particles[i].display();
    }

    fill(255);
    textSize(32);
    text("   The Future Is Now",
        mouseX, mouseY, 600, 200);
}

console.log('hello'+'world'.repeat(3));