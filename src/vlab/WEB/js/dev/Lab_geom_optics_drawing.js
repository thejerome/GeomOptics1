function drawCanvasWithLenses(lensesArray) {
	var cnv = document.getElementById('content');
    draw = Raphael('content', 1000, 720);
    cnv.style.height = 720+'px';
	var lensesCount = (lensesArray.length - 2) / 2;
	var dSummary = 0;
	for (var i = 0; i < (lensesCount-1); i++)
		dSummary += lensesArray[1+2*i];
	var ALLOHAFOCUS = 0;
	for (var i = 0; i < lensesCount; i++)
		ALLOHAFOCUS = Math.abs(lensesArray[2*i]) > ALLOHAFOCUS ? Math.abs(lensesArray[2*i]) : ALLOHAFOCUS;
	draw.setSize(dSummary + ALLOHAFOCUS*2 + 100 + Math.abs((lensesArray[lensesArray.length - 2])), 720);
	cnv.style.width = (dSummary + ALLOHAFOCUS*2 + 100 + Math.abs((lensesArray[lensesArray.length - 2]))) + 'px';
	arrayForParallel.push(draw.path('M10 '+(parseInt(cnv.style.height)/2)+'L'+(parseInt(cnv.style.width)-10)+' '+(parseInt(cnv.style.height)/2)).attr({'stroke-width': 2, 'stroke-dasharray': "-."}));
	var currentLensPosition = (parseInt(cnv.style.width) - dSummary)/2;
	var focuses = new Array;
	for (var i = 0; i < lensesCount; i++) {
		var f = lensesArray[2*i];
		currentLensPosition += (i==0 ? 0 : lensesArray[2*i - 1]);
			interspectionPointsArray.push(Array(currentLensPosition, parseInt(cnv.style.height)/2));
			lensesPosition.push(currentLensPosition);
		var lens = draw.path('M'+currentLensPosition+' 100L'+currentLensPosition+' 620').attr({'stroke-width': 3, "stroke": "blue"});
			lenses.push(lens);
			subsidiaryEls.push(lens);
			draw.path('M'+(currentLensPosition-10)+' '+(90+(f>0 ? 20 : 0))+'L'+currentLensPosition+' 100L'+(currentLensPosition+10)+' '+(90+(f>0 ? 20 : 0))).attr({'stroke-width': 3, "stroke": "blue"});
			draw.path('M'+(currentLensPosition-10)+' '+(610+(f>0 ? 0 : 20))+'L'+currentLensPosition+' 620L'+(currentLensPosition+10)+' '+(610+(f>0 ? 0 : 20))).attr({'stroke-width': 3, "stroke": "blue"});
		for (var j = 0; j < 2; j++) {
			subsidiaryEls.push(draw.path('M'+(currentLensPosition-f+(2*f*j))+' 10L'+(currentLensPosition-f+(2*f*j))+' 710').attr({'stroke-width': 2, "stroke": "DeepSkyBlue", "stroke-dasharray": "-"}));
			draw.circle(currentLensPosition-f+(2*f*j), parseInt(cnv.style.height)/2, 4).attr({'fill': "black"});
			focuses.push(draw.text(currentLensPosition-f+(2*f*j), (parseInt(cnv.style.height)/2)+20, 'F'+(i+1)+('\'').repeat(j)).attr({'font-size':14}));
			interspectionPointsArray.push(Array(currentLensPosition-f+(2*f*j), parseInt(cnv.style.height)/2));
		}
	}
	for (var j = 0; j < focuses.length - 1; j++)
		for (var k = j + 1; k < focuses.length; k++)
			if (Math.abs(focuses[j].attrs.x - focuses[k].attrs.x) < 20)
				focuses[j].attr({'y': ((parseInt(cnv.style.height)/2)-20)});

	resize();
	window.onresize = resize;

	document.getElementById('comments').onmouseover = function() {
		document.getElementById('comments').style.color = '#333';
	}
	
}

function drawRay(angleOfRay, heightOfRay) {
	var cnv = document.getElementById('content');
	var x = lensesPosition[0];
        incomingRay = draw.path('M'+(x-200*Math.cos(angleOfRay))+' '+(heightOfRay + (200*Math.sin(angleOfRay)))+'L'+x+' '+heightOfRay).attr({'stroke-width': 3, "stroke": "black"});
 	var arr = new Array(x, heightOfRay);
        endPts.push(arr);
        arrayForParallel.push(incomingRay);
}

function drawObject(y, z) {
	var cnv = document.getElementById('content');
	var x = lensesPosition[0];
		incomingObject = draw.path('M'+(x+z)+' '+parseInt(cnv.style.height)/2+'L'+(x+z)+' '+(parseInt(cnv.style.height)/2-y)+'L'+(x+z-5)+' '+(parseInt(cnv.style.height)/2-y+5)+'M'+(x+z)+' '+(parseInt(cnv.style.height)/2-y)+'L'+(x+z+5)+' '+(parseInt(cnv.style.height)/2-y+5));
	interspectionPointsArray.push(Array(x+z, parseInt(cnv.style.height)/2-y));
}

function resize() {
	var cnv = document.getElementById('content');
	var browserWidth = parseInt(window.innerWidth);
	if (parseInt(cnv.style.width) + 350 > browserWidth) {
		var blockOfComments = document.getElementById('comments');
		blockOfComments.style.width = ((parseInt(cnv.style.width) - 360) + 'px');
		blockOfComments.style.height = '225px';
		var blockOfButtons = document.getElementById('buttonsBlock');
		blockOfButtons.style.cssFloat = 'left';
		blockOfButtons.style.width = '350px';
		document.getElementById('content').style.cssFloat = 'none';
	} else {
		var blockOfComments = document.getElementById('comments');
		blockOfComments.style.width = '325px';
		blockOfComments.style.height = '445px';
		var blockOfButtons = document.getElementById('buttonsBlock');
		blockOfButtons.style.cssFloat = 'none';
		blockOfButtons.style.removeProperty('width');
		document.getElementById('content').style.cssFloat = 'left';
	}
}