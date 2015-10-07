//DEBUG
var debugCoords = true;

var inited = false;
var mousePos = {x: 0, y: 0};
var update;
var boardOffset = {x: 100, y:60};
var sceneSize = 600;
var sScale = (sceneSize / 20);

var canvas = document.getElementById("gameCanvas");
var stage = new createjs.Stage(canvas);

var piecesData = {
	images: ["images/xiangqi-pieces-sprites-small.png"],
	frames: {width:50, height:50,count:14, regX: 25, regY:25, spacing:0, margin:0},
	animations: {
		red_general:0, 
		red_advisor:1, 
		red_horse:2, 
		red_elephant:3, 
		red_chariot:4, 
		red_cannon:5, 
		red_soldier:6,
		
		black_general:7, 
		black_advisor:8, 
		black_horse:9, 
		black_elephant:10,
		black_chariot:11,
		black_cannon:12, 
		black_soldier:13
	}
};
var piecesSheet = new createjs.SpriteSheet(piecesData);


function createPieces(){
	var boardPosition = {x:0, y:0};
	var wtg = {x:0,y:0};
	// wtg = World To Grid
	for (var i = 0; i < 32; i++){
	var pieceType = "soldier";
	// pieceType has a safe default value
	if (i < 16){
		pieceType = "red_" + getPieceName(i);
	}else{
		pieceType = "black_" + getPieceName(i - 16);
	}
	var piece = new createjs.Sprite(piecesSheet, pieceType);
	container.addChild(piece);
	if (i < 16){
	piece.name = (pieceType);
	}else{
	piece.name = (pieceType);	
	}
	piece.on("pressmove", function (evt) {
		mousePos = {x: evt.stageX, y: evt.stageY};
		this.x = mousePos.x;
		this.y = mousePos.y;
		wtg = getWorldSpaceToNearestGrid(this.x,this.y);
	   // console.log("Press Move");
		// indicate that the stage should be updated on the next tick:
		update = true;
	});
	piece.on("rollover", function (evt) {
		this.scale =  1.2;
	 //   update = true;
	});
	piece.on("pressup", function(evt) { 
		console.log("up"); 
		var gtw = gridToScreenPos(wtg.x,wtg.y);
		this.x = gtw.x;
		this.y = gtw.y;
	});	
	piece.on("pressdown", function(evt){
		boardPosition = getWorldSpaceToNearestGrid(this.x,this.y);
		//boardPosition.y = getWorldSpaceToNearestGrid();
	});
	piece.on("rollout", function (evt) {
		 this.scaleX = piece.scaleY =  1;
		update = true;
	});
		var startPos = getStartingPosition(pieceType);
		startPos = gridToScreenPos(startPos.x, startPos.y);
		//console.log(startPos);
			piece.x = startPos.x;
			piece.y = startPos.y;
	}
}


var container = new createjs.Container();
function getPieceName(n){
	if (n < 5){
		return "soldier";	
	}else if( n < 7){
		return "chariot";	
	}else if(n < 9){
		return "cannon";
	}else if(n < 11){
		return "horse";	
	}else if(n < 13){
		return "elephant";
	}else if(n < 15){
		return "advisor";
	}else if(n == 15){
		return "general";	
	}else{
		console.log("error: incorrect ID for pieceType");	
	}
}

var red_count ={
		soldier: 0,
		cannon: 0,
		chariot: 0,
		horse: 0,
		elephant: 0,
		advisor: 0,
		general: 0
}
var black_count ={
		soldier: 0,
		cannon: 0,
		chariot: 0,
		horse: 0,
		elephant: 0,
		advisor: 0,
		general: 0
}

function isValidMove(piece,lastx,lasty, x,y){
	
	
	var lgrid = {x:0, y:0};
	lgrid = getWorldSpaceToNearestGrid(lastx,lasty);
	
	if(debugCoords){
		console.log("isValidMove:" + piece.name + " x:" + lastx + " y:" + lasty + " x:" + x + " y:" + y); 
		console.log("isValid: n:" + piece.name + " x:" + lgrid.x + " y:" + lgrid.y); 
	}
	
	var name = piece.name.split("_");
	switch(name[1]){
		case "soldier":
		if(Math.abs(lgrid.y - y) == 1){
			return true;	
		}else{
			console.log("false: " + Math.abs(piece.y - y));
		return false;
		}
		break;
		case "cannon":
	
			break;
		case "chariot":
		
			break;
		case "horse":
			
			break;
		case "elephant":
			
			break;
		case "advisor":
		
			break;
		case "general":
	
			break;
			
			
			
	}
	return false;
}
function getLinePosition(name, count){
	var retVal = 0;
	switch(name){
		case "soldier":
			retVal = count.soldier * 2 + 1;
			count.soldier++;
			break;
		case "cannon":
			retVal = count.cannon * 6 + 2;
			count.cannon++;
			break;
		case "chariot":
			retVal = count.chariot * 8 + 1;
			count.chariot++;
			break;
		case "horse":
			retVal = count.horse * 6 + 2;
			count.horse++;
			break;
		case "elephant":
			retVal = count.elephant * 4 + 3;
			count.elephant++;
			break;
		case "advisor":
			retVal = count.advisor * 2 + 4;
			count.advisor++;
			break;
		case "general":
			retVal = 5;
			count.general++;
			break;
	}
	return retVal;
}
function getStartingPosition(pieceName){
	var name = pieceName.split("_");
	var pos = {x:1,y:1};
	switch(name[1]){
		case "soldier":
			pos.y = 4;
			break;
		case "cannon":
			pos.y = 3;
			break;
		default:
			pos.y = 1;
	}
	if(name[0] == "red"){
		pos.y = 11 - pos.y;	
		pos.x = getLinePosition(name[1],red_count);
	}else{
		pos.x = getLinePosition(name[1],black_count);	
	}
	
	
	
	return pos;
}
function getWorldSpaceToNearestGrid(x,y){
	var retVal = {x:0,y:0};
	retVal.x = ((x - boardOffset.x) / (sceneSize / 11)) + 1; 

	if (((y - boardOffset.y) / (sceneSize / 11)) < 4.5){
		retVal.y = ((y - boardOffset.y) / (sceneSize / 11)) + 1;
	}else{
		retVal.y = (((y - sScale) - boardOffset.y) / (sceneSize / 11)) + 1;
	}	
	
	retVal.x = Math.round(retVal.x);
	retVal.y = Math.round(retVal.y);
	//pos.x = boardOffset.x + i * (sceneSize / 11);
	//pos.y = boardOffset.y + j * (sceneSize / 11);
	if (debugCoords) {
		console.log("WorldToGrid x:" + x + " y:" + y + " = x:" + retVal.x + " y:" + retVal.y);
	}
	return retVal;
}


circle = new createjs.Shape();
var g = new createjs.Graphics();

function gridToScreenPos(i,j){
	i--;
	j--;
	var pos = {x:0,y:0};
	pos.x = boardOffset.x + i * (sceneSize / 11);
	pos.y = boardOffset.y + j * (sceneSize / 11);

	if (j > 4){
		pos.y = pos.y + sScale;	
	}
	if (debugCoords){
	console.log("Grid To World: x:" + pos.x + " y:" + pos.y);
	}
	return pos;
}
function drawLine(xa,ya,xb,yb,color){
	var myline = new createjs.Shape();
	myline.graphics.setStrokeStyle(1);
	myline.graphics.beginStroke(color);
	myline.graphics.moveTo(xa, ya);
	myline.graphics.lineTo(xb, yb);
	myline.graphics.endStroke();
	container.addChild(myline);
}
function drawBoard(){
	
	
	palaceLineStart = gridToScreenPos(4,1);
	palaceLineEnd =	gridToScreenPos(6,3);
	drawLine(palaceLineStart.x,palaceLineStart.y,palaceLineEnd.x,palaceLineEnd.y,"red");
	palaceLineStart = gridToScreenPos(6,1);
	palaceLineEnd =	gridToScreenPos(4,3);
	drawLine(palaceLineStart.x,palaceLineStart.y,palaceLineEnd.x,palaceLineEnd.y,"red");
	
	palaceLineStart = gridToScreenPos(4,8);
	palaceLineEnd =	gridToScreenPos(6,10);
	drawLine(palaceLineStart.x,palaceLineStart.y,palaceLineEnd.x,palaceLineEnd.y,"red");
	palaceLineStart = gridToScreenPos(6,8);
	palaceLineEnd =	gridToScreenPos(4,10);
	drawLine(palaceLineStart.x,palaceLineStart.y,palaceLineEnd.x,palaceLineEnd.y,"red");
	
	
	for (i = 0; i < 9; i++){
		for (j = 0; j < 10; j++){
			var extend = {x: 0, y:0};
			// extend: draw lines positive and negative from grid position: 0 = do both, 1 = positive only, -1 = negative only
			var pos = {x: 0, y:0};
			
			pos = gridToScreenPos(i+1,j+1);
			
			var x = pos.x;
			var y = pos.y;
			
			if (j == 0){
				var text = new createjs.Text(i+1, "20px Arial", "#5555bb");
				text.x = pos.x - sScale / 4;
				text.y  = pos.y - boardOffset.y / 4;
				text.textBaseline = "alphabetic";
				container.addChild(text);
			}
			if (i == 0){
				var text = new createjs.Text(j+1, "20px Arial", "#bb5555");
				text.y = y;
				text.x  = pos.x - boardOffset.x / 4;
				text.textBaseline = "alphabetic";
				container.addChild(text);
			}
			var xline = new createjs.Shape();
			xline.graphics.setStrokeStyle(1);
			xline.graphics.beginStroke("black");
			if (j == 4 || j == 5){
			xline.graphics.beginStroke("blue");
			}
			
			if (i == 0){
				extend.x = 1;
			}else if(i == 8){
				extend.x = -1;
			}else{
				extend.x = 0;	
			}
			if (extend.x == 0){
				xline.graphics.moveTo(x-sScale, y);
				xline.graphics.lineTo(x+sScale, y);
			}else if(extend.x < 0){
				xline.graphics.moveTo(x-sScale, y);
				xline.graphics.lineTo(x, y);
			}else if(extend.x > 0){
				xline.graphics.moveTo(x, y);
				xline.graphics.lineTo(x+sScale, y);	
			}
			xline.graphics.endStroke();
			container.addChild(xline);
			var yline = new createjs.Shape();
			yline.graphics.setStrokeStyle(1);
			yline.graphics.beginStroke("black");
			
			
			if (j == 0 || j == 5){
				extend.y = 1;
			}else if(j == 9 || j == 4){
				extend.y = -1;
			}else{
				extend.y = 0;	
			}
			if (extend.y == 0){
				yline.graphics.moveTo(x, y-sScale);
				yline.graphics.lineTo(x, y+sScale);
			}else if(extend.y < 0){
				yline.graphics.moveTo(x, y-sScale);
				yline.graphics.lineTo(x, y);
			}else if(extend.y > 0){
				yline.graphics.moveTo(x, y);
				yline.graphics.lineTo(x, y+sScale);	
			}
		
			yline.graphics.endStroke();
			container.addChild(yline);		
		}
	}
}
function init(){
	stage.addChild(container);
    inited = true;
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Touch.enable(stage);  
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true; 
	drawBoard();
	//var piece = new createjs.Sprite(piecesSheet, "horse");
	//piece.x = piece.y = 40;
	//container.addChild(piece);
	//drawPieces();
 	createPieces();	
}
function tick(event) {
	update = false;
	stage.update(event);
}
