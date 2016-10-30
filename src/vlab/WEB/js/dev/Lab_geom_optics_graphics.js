function g_cancel() {
    if(els.length == 0) 
        return null;
    els[els.length - 1].remove();
    els.splice(els.length - 1, 1);
    endPts.pop();
    interspectionPointsArray.splice(0, 1);
}

function g_cancel_parallel() {
    if(subsidiaryEls.length <= (lenses.length * 3)) 
        return null;
    var id = subsidiaryEls[subsidiaryEls.length - 1].id;
    for (var i = 0; i < arrayForParallel.length; i++) {
        if (arrayForParallel[i].id == id) {
            arrayForParallel.splice(i, 1);
            break;
        }
    }
    subsidiaryEls[subsidiaryEls.length - 1].remove();
    subsidiaryEls.splice(subsidiaryEls.length - 1, 1);
    interspectionPointsArray.splice(interspectionPointsArray.length - interspectionPointsNumberArray[interspectionPointsNumberArray.length-1], interspectionPointsNumberArray[interspectionPointsNumberArray.length-1]);
    interspectionPointsNumberArray.pop();
}

function g_cancel_image() {
    if(images.length == 0)
        return null;
    images[images.length - 1].remove();
    images.splice(images.length - 1, 1);
    interspectionPointsArray.splice(0, 1);
}

function g_line() {
    makeButtonsDisabled();
    document.getElementById('line').className = 'mainEnabled';
    document.getElementById('comments').innerHTML = commentsRay;
    var cnv = document.getElementById('content');
    cnv.onmousedown = function(e) {
        var cnv = document.getElementById('content');
        var mouseDown = makeLinking(e, 1);
        //Если попали в + - конец луча - тогда можно и порисовать
        //ну, конечно, если луч не последний
        if((Math.max(mouseDown.x, endPts[endPts.length - 1][0]) - Math.min(mouseDown.x, endPts[endPts.length - 1][0])) <= 7 &&
        	(Math.max(mouseDown.y, endPts[endPts.length - 1][1]) - Math.min(mouseDown.y, endPts[endPts.length - 1][1])) <= 7 &&
                els.length < lenses.length) {
        	var x = endPts[endPts.length - 1][0];
	        var y = endPts[endPts.length - 1][1];
	        var lastl = false;
	        var tsnum = els.length;
	        cnv.onmousemove = function(e) {
                var mouse = makeLinking(e, 2);
                if(lastl) {
	            	lastl.remove();
	            	endPts.pop();
                    arrayForParallel.pop();
	            }
	            var l = draw.path('M'+x+' '+y+'L'+mouse.x+' '+mouse.y);
	            l.attr({'stroke-width': 3, "stroke": "black"});
	            lastl = l;
	            els[tsnum] = l;
                arrayForParallel.push(l);
	            var newEndPt = new Array(l.attrs.path[1][1], l.attrs.path[1][2]);
	            endPts.push(newEndPt);
        	}
    	}
    }
    cnv.onmouseup = function() {
        var cnv = document.getElementById('content');
        //перебор массива линз и поиск следующей линзы
        var nextLens;
        var ray = els[els.length-1];
        var p1 = ray.attrs.path[0];
        var p2 = ray.attrs.path[1];
        for (var i = 0; i < lenses.length; i++) {
            var lens = lenses[i];
            if (lens.attrs.path[0][1] > p1[1]) {
                nextLens = lens;
                break;
            };
        }
        //если таковая имеется - продолжим луч до нее и изменим конечную точку, а нет - так сойдет
        if (nextLens) {
            var koeff = (p1[2] - p2[2])/(p1[1] - p2[1]);
            var koeffb = p2[2] - (koeff * p2[1]);
            var newPath = ray.attrs.path;
            newPath[1][1] = nextLens.attrs.path[0][1];
            newPath[1][2] = koeffb + (koeff * nextLens.attrs.path[0][1]);
            endPts.pop();
            ray.attr({"path" : newPath});
            var newEndPt = new Array(ray.attrs.path[1][1], ray.attrs.path[1][2]);
            endPts.push(newEndPt);
            interspectionPointsArray.splice(0, 0, newEndPt);
        }
        cnv.onmousemove = null;
    }
}

function g_line_parallel() {
    makeButtonsDisabled();
    document.getElementById('line_parallel').className = 'subsidiaryEnabled';
    document.getElementById('comments').innerHTML = commentsParallel;
    var cnv = document.getElementById('content');

    cnv.onmousedown = function(e) {
        var mouseDown = makeLinking(e, 1);
        var existingLine;
        for (var i = 0; i < arrayForParallel.length; i++) {
            var el = arrayForParallel[i];
            if (isPointInsideDirectLine(mouseDown, el)) {
                //расчет параметров параллельной прямой
                existingLine = el;
                var lastl = false;
                var tsSubsNum = subsidiaryEls.length;
                //непосредственный расчет
                var p1 = existingLine.getPointAtLength(1);
                var p2 = existingLine.getPointAtLength(20);
                koeff = (p1.y - p2.y)/(p1.x - p2.x + 0.001);
                var cnv = document.getElementById('content');
                cnv.onmousemove = function(e) {
                    if (lastl) {
                        lastl.remove();
                    };
                    //перерасчет координат прямой
                    var mouse = makeLinking(e, 2);
                    var b = mouse.y - (mouse.x * koeff);
                    x1st = 0;
                    x2nd = draw.width;
                    y1st = koeff * x1st + b;
                    y2nd = koeff * x2nd + b;
                    var l = draw.path('M'+x1st+' '+y1st+'L'+x2nd+' '+y2nd);
                    l.attr({'stroke-width': 2, "stroke": "grey", "stroke-dasharray": "-"});
                    lastl = l;
                    subsidiaryEls[tsSubsNum] = l;
                }
                break;
            }
        }
    }
    cnv.onmouseup = function(e) {
        arrayForParallel.push(subsidiaryEls[subsidiaryEls.length-1]);
        var cnv = document.getElementById('content');
        cnv.onmousemove = null;
        findAndWritePointsOfInterspection();
    }
}

function g_line_two_points() {
    makeButtonsDisabled();
    document.getElementById('line_two_points').className = 'subsidiaryEnabled';
    document.getElementById('comments').innerHTML = commentsTwoPoints;
    var cnv = document.getElementById('content');
    cnv.onmousedown = function(e) {
        var cnv = document.getElementById('content');
        var mouseDown = makeLinking(e, 1);
        var lastl = false;
        var tsSubsNum = subsidiaryEls.length;
        cnv.onmousemove = function(e) {
            if (lastl)
                lastl.remove();
            var mouseMove = makeLinking(e, 2);
            var koeff = (mouseDown.y - mouseMove.y)/(mouseDown.x - mouseMove.x);
            var koeffb = mouseMove.y - (koeff * mouseMove.x);
            x1st = 0;
            x2nd = draw.width;
            y1st = koeff * x1st + koeffb;
            y2nd = koeff * x2nd + koeffb;
            if ((Math.abs(y1st) + Math.abs(y2nd)) < 500000) { //check if not vertical
                var l = draw.path('M'+x1st+' '+y1st+'L'+x2nd+' '+y2nd);
                l.attr({'stroke-width': 2, "stroke": "grey", "stroke-dasharray": "-"});
                lastl = l;
                subsidiaryEls[tsSubsNum] = l;
            }
        }
    }
    cnv.onmouseup = function(e) {
        var cnv = document.getElementById('content');
        arrayForParallel.push(subsidiaryEls[subsidiaryEls.length-1]);
        cnv.onmousemove = null;
        findAndWritePointsOfInterspection();
    }
}

function g_make_image() {
    makeButtonsDisabled();
    var cnv = document.getElementById('content');
    cnv.onmouseup = null;
    document.getElementById('line').className = 'mainEnabled';
    document.getElementById('comments').innerHTML = commentsImage;
    cnv.onmousedown = function(e) {
        var mouse = makeLinking(e, 2);
        interspectionPointsArray.splice(0, 0, Array(mouse.x, mouse.y));
        if (mouse.y > 360) {
            var image = draw.path('M'+(mouse.x)+' 360'+'L'+(mouse.x)+' '+(mouse.y)+'L'+(mouse.x-5)+' '+(mouse.y-5)+'M'+(mouse.x)+' '+(mouse.y)+'L'+(mouse.x+5)+' '+(mouse.y-5));
            images.push(image);
        } else {
            var image = draw.path('M'+(mouse.x)+' 360'+'L'+(mouse.x)+' '+(mouse.y)+'L'+(mouse.x-5)+' '+(mouse.y+5)+'M'+(mouse.x)+' '+(mouse.y)+'L'+(mouse.x+5)+' '+(mouse.y+5));
            images.push(image);
        }
        makeButtonsDisabled();
        onloadImage();
        var cnv = document.getElementById('content');
        cnv.onmousedown = null;
    }
}