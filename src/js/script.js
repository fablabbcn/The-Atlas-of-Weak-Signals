var text1 = new Blotter.Text("Hello", {
    family : "Overpass Mono",
    size : 120,
    fill : "#171717"
});

var text2 = new Blotter.Text("Sup", {
    family : "Overpass Mono",
    size : 120,
    fill : "#171717"
});

var material = new Blotter.FliesMaterial();

var blotter1 = new Blotter(material, { texts : text1 });
var scope1 = blotter1.forText(text1);
scope1.appendTo(document.body);

// var blotter2 = new Blotter(material, { texts : text2 });
// var scope2 = blotter2.forText(text2);
// scope2.appendTo(document.body);

setTimeout(function(){
    var element = $('.b-canvas').detach();
    $('.s00').append(element);
},2000);