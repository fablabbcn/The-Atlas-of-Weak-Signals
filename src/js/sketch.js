function randomIntFromInterval(min,max){ //min max may be included
    return Math.floor(Math.random()*(max-min+1)+min);
}


var particles = [];
var limit = 10;
var weaksignals = [];
var keywords = [];
var attractors = [];
var jsonData = {};
var padding = 100;
var grid = 5;


function preload() {
    var jsonFile = "../fromspreadsheet.json";
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