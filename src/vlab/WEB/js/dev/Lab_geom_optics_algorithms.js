//returns true if line elmnt contains point (mouse)
function isPointInsideDirectLine(mouse, elmnt) {
    if (!elmnt.attrs)
        return null;
    var p1 = elmnt.attrs.path[0];
    var p2 = elmnt.attrs.path[1];
    var koeffK = (p1[2] - p2[2])/(p1[1] - p2[1] + 0.0001);
    var koeffB = p2[2] - (p2[1] * koeffK);
    if (Math.abs(mouse.y - koeffK*mouse.x - koeffB) < 5 &&
        mouse.x > p1[1] && mouse.x < p2[1])
        return true;
    else
        return false;
}

//returns an angle ABC in degrees
function calculateAngle(Ax, Ay, Cx, Cy, Bx, By) {
    var first = ((Ax-Bx)*(Cx-Bx) + (Ay-By)*(Cy-By));
    var second = Math.pow(Math.pow((Ax-Bx),2)+Math.pow((Ay-By),2),1/2);
    second *= Math.pow(Math.pow((Cx-Bx),2)+Math.pow((Cy-By),2),1/2);
    return (180/Math.PI)*Math.acos(first/second);
}

function makeButtonsDisabled() {
    document.getElementById('line').className = 'main';
    document.getElementById('line_parallel').className = 'subsidiary';
    document.getElementById('line_two_points').className = 'subsidiary';
    document.getElementById('cancel').className = 'cancel';
    document.getElementById('cancel_parallel').className = 'cancel';
}

//function writes interspection points to interspectionPointsArray 
//and their quantity to interspectionPointsNumberArray
function findAndWritePointsOfInterspection() {
    var currentLine = subsidiaryEls[subsidiaryEls.length - 1];
    var numberOfInterspectionPoints = 0;
    for (var i=0; i < subsidiaryEls.length - 1; i++) {
        var previousLine = subsidiaryEls[i];
        if (checkIntrospection(currentLine, previousLine)) {
            interspectionPointsArray.push(checkIntrospection(currentLine, previousLine));
            numberOfInterspectionPoints++;
        }
    }
    interspectionPointsNumberArray.push(numberOfInterspectionPoints);
}

//returns array of coordinates if lines interspect
function checkIntrospection(line1, line2) {
    if (!line1.attrs || !line2.attrs)
        return null;
    var p1l1 = line1.attrs.path[0];
    var p2l1 = line1.attrs.path[1];
    var p1l2 = line2.attrs.path[0];
    var p2l2 = line2.attrs.path[1];
    var k1 = (p1l1[2] - p2l1[2])/(p1l1[1] - p2l1[1] + 0.0001);
    var b1 = p2l1[2] - (p2l1[1] * k1);
    var k2 = (p1l2[2] - p2l2[2])/(p1l2[1] - p2l2[1] + 0.0001);
    var b2 = p2l2[2] - (p2l2[1] * k2);
    if (k1 === k2)
        return false;
    var point = new Array;
    point[0] = (b2-b1)/(k1-k2);
    point[1] = k1*point[0] + b1;
    var cnv = document.getElementById('content');
    var width = parseInt(cnv.style.width, 10);
    var height = parseInt(cnv.style.height, 10);
    if (point[0] < width && point[0] > 0 &&
        point[1] < height && point[1] > 0) {
        return point;
    }
    return false;
}

//returns struct of mouseX & mouseY after linking, if it (linking) is possible
//or returns usual mouse coordinates
//mistake varieties on click: 1 is mousedown, 2 is mouseup or mousemove
function makeLinking(e, mistake) {
    mistake = mistake === 1 ? 3 : 6;
    if (!e)
        e = window.event;
    var offset = document.getElementById('content').offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    for (i = 0; i < interspectionPointsArray.length; i++) {
        var linkingPoint = interspectionPointsArray[i];
        if ((Math.max(x, linkingPoint[0]) - Math.min(x, linkingPoint[0]) <= mistake) &&
            (Math.max(y, linkingPoint[1]) - Math.min(y, linkingPoint[1]) <= mistake))
            return {x: linkingPoint[0], y: linkingPoint[1]};
    }
    return {x: x, y: y};
}

//repeats a string n times
String.prototype.repeat = function(n) {
    return new Array(n+1).join(this);
}

function raysMakePacketForSend() {
    makeButtonsDisabled();
    //попробуем найти угол
    //положительный угол - вращение по часовой стрелке
    //аргументы: точка 1, точка 2, вершина угла
    //добавим в массив els входящий луч
    els.splice(0, 0, incomingRay);
    var packet = new Array;
    for (var i = 0; i < endPts.length - 1; i++) {
        var packageForAdd = new Array;
        var heightOfRay = 360 - endPts[i][1];
        //расчет углов
        var alpha1 = calculateAngle(els[i].attrs.path[0][1], els[i].attrs.path[0][2], lenses[i].attrs.path[1][1], lenses[i].attrs.path[1][2], endPts[i][0], endPts[i][1]);
        var alpha2 = calculateAngle(lenses[i].attrs.path[1][1], lenses[i].attrs.path[1][2], els[i+1].attrs.path[1][1], els[i+1].attrs.path[1][2], endPts[i][0], endPts[i][1]);
        var packageForAdd = new Array;
        packageForAdd.push(heightOfRay);
        packageForAdd.push(alpha1);
        packageForAdd.push(alpha2);
        packet.push(packageForAdd);
    }
    els.splice(0, 1);
    document.getElementById('comments').innerHTML = commentsSend;
    return packet;
}

function imageMakePacketForSend() {
    makeButtonsDisabled();
    var packet = new Array;
    for (var i = 0; i < images.length; i++) {
        var currentImage = images[i].attrs.path[1];
        currentImage.splice(0, 1);
        currentImage[1] = 360 - currentImage[1];
        currentImage[0] = currentImage[0] - lensesPosition[i];
        packet.push(currentImage);
    };
    document.getElementById('comments').innerHTML = commentsSend;
    return packet;
}