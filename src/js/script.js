// (function ($, window, document, undefined) {

var text1 = new Blotter.Text("under construction 👁‍🗨", {
    family : "Overpass Mono",
    size : 84,
    fill : "#171717"
});

var text2 = new Blotter.Text("ATLAS OF WEAK SIGNALS", {
    family : "'Nexa Bold', sans-serif",
    size : 54,
    fill : "#171717"
});

var material = new Blotter.ChannelSplitMaterial();
var material2 = new Blotter.FliesMaterial();

// var blotter1 = new Blotter(material, { texts : text1 });
// var scope1 = blotter1.forText(text1);
// scope1.appendTo(document.body);

var blotter2 = new Blotter(material2, { texts : text2 });
var scope2 = blotter2.forText(text2);
scope2.appendTo(document.body);

setTimeout(function(){
    var element = $('.b-canvas').detach();
    $('.modal').prepend(element);
},1);


(function() {
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        $("#close").click(function (event) {
            event.preventDefault();
            $('.modal').hide();
        });
    }
    document.getElementsByTagName("head")[0].appendChild(script);
})(jQuery, window, document);


//https://codepen.io/SimonEvans/pen/PQKgyQ
// https://github.com/bradley/blotter
// https://blotter.js.org/#/documentation