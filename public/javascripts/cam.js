var ws = null;
var stream = document.getElementById("stream");
var container = document.getElementById("container");
var context = stream.getContext("2d");
var image = null;
var imageEle = "<div id=\"##id\" class=\"captured-frame\"><img class=\"frame-image\" src=\"##src\" /><div class=\"frame-title\"><a href=\"##href\" download=\"##title\">##title</a></div></div>";

function adjustSize(width, height) {
    stream.width = width;
    stream.height = height;
    stream.style.width = width + "px";
    stream.style.height = height + "px";
    container.style.width = width + "px";
    container.style.height = height + "px";
    adjustPos();
}

function adjustPos() {
    //Adjust player
    $("#container").css("margin-top", function (index) {
        return ($("window").height() / 2) + ($("#container").height() / 2);
    });
    //        $("#container").css("margin-right", function (index) {
    //            return ($("document").width() - $("#captures").width()) / 2 + ($("#container").width() / 2);
    //        });
    $("#container").css("margin-left", function (index) {
        return ((window.innerWidth) - $("#captures").width() - ($("#container").width())) / 2;
    });
}

$(document).ready(function () {

    adjustPos();


    $("#pause").hide();

});

//FPS Calculation
var currentFps = 0,
    fps = 0;

function drawFrame(image) {
    var img = new Image();
    img.onload = function () {
        context.drawImage(img, 0, 0);
    };
    img.src = image;
}

function closeCamera() {
    $("#play").show();
    $("#pause").hide();
    ws.send("close");
}

function openCamera() {
    ws = new WebSocket("ws://" + window.location.host.split(":")[0] + ":9090");
    var sizeReceived = false;
    ws.onopen = function () {
        ws.send("open");
    };

    ws.onerror = function (e) {
        console.log(e);
    };

    ws.onmessage = function (message) {
        var data = JSON.parse(message.data);
        switch (data.type) {
        case "size":
            adjustSize(data.width, data.height);
            break;
        case "frame":
            if (!sizeReceived) {
                sizeReceived = true;
                ws.send("size");
            }
            image = "data:image/png;base64," + data.frame;
            drawFrame(image);
            break;

        }
    };
    $("#play").hide();
    $("#pause").show();
}

function capture() {
    var cap = document.getElementById("acapture");
    cap.href = image;
    cap.download = "" + new Date().getTime() + ".jpg";
    $("#acapture").click();
    var id = "" + new Date().getTime();
    var capImage = imageEle.replace("##id", id).replace("##src", image).replace("##href", image).replace(/##title/g, "" + id + ".jpg");
    $("#captures").prepend(capImage);
}