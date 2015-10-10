//https://bahmni.atlassian.net/wiki/x/cgA7AQ
var canvas = document.getElementById("gameCanvas");
var stage = new createjs.Stage(canvas);
var container = new createjs.Container();
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

function screenSpaceToNearestGrid(x,y){
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
		console.log("ScreenToGrid x:" + x + " y:" + y + " = x:" + retVal.x + " y:" + retVal.y);
	}
	return retVal;
}

var sceneSize = 600;
var boardOffset = {x: 100, y:60};
var sScale = (sceneSize / 20);
var update = true;
var debugCoords = false;

function getPieceName(id){
	var team = "";
	var name = "";
	if (id < 16){
		team = "red"
	}else{
		team = "black"
		id = id - 16;
	}
	if (id < 5){
		name = "soldier";	
	}else if( id < 7){
		name = "chariot";	
	}else if(id < 9){
		name = "cannon";
	}else if(id < 11){
		name = "horse";	
	}else if(id < 13){
		name = "elephant";
	}else if(id < 15){
		name = "advisor";
	}else if(id == 15){
		name = "general";	
	}else{
		console.log("error: incorrect ID for pieceType");	
	}
	return team + "_" + name;
}
//var ChessPiece.prototype.gridPos = {x:0,y:0};
var ChessPiece = function(pieceType,gridPos,sprite){

	this.gridPos = {x:0,y:0};
	var screenPos = {x:0,y:0};
	this.pieceType = pieceType;
	this.sprite = sprite;
	this.gridPos = gridPos;
	var piece = this;
	this.sprite = sprite;
	var testStr = "test " + this.pieceType;
	
	this.getTestStr = function(){
		return testStr;	
	};
	
	
	screenPos = gridToScreenPos(gridPos.x, gridPos.y);
	console.log("creating: " + pieceType + " @ " + gridPos.x + ", " + gridPos.y + ": ScreenPos: " + screenPos.x + " ," + screenPos.y);
	
	sprite.x = screenPos.x;
	sprite.y = screenPos.y;
	container.addChild(sprite);
	
	sprite.on("pressmove", function (evt) {
		mousePos = {x: evt.stageX, y: evt.stageY};
		this.x = mousePos.x;
		this.y = mousePos.y;
		update = true;
	});
	sprite.on("pressup", function(evt) { 
		console.log("up");
		
		gridPos = screenSpaceToNearestGrid(this.x,this.y);
		screenPos = gridToScreenPos(gridPos.x, gridPos.y);
		this.x = screenPos.x;
		this.y = screenPos.y;
		update = true;
	

	});	
	sprite.on("pressdown", function(evt){
		
	});
};

ChessPiece.prototype.updatePiece = function(){
	var t = this.getTestStr();
	console.log("! " + this.pieceType + " ->" + this.gridPos.x + "," + this.gridPos.y + " ," + t);
};

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
	console.log("Grid To Screen: x:" + pos.x + " y:" + pos.y);
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
function drawText(txt,x,y){
	var text = new createjs.Text(txt, "20px Arial", "#bb5555");
	text.y = y;
	text.x  = x - boardOffset.x / 4;
	text.textBaseline = "alphabetic";
	container.addChild(text);
}
function drawBoard(){
	var startLine = {x:0,y:0};
	var endLine = {x:0,y:0};
	for (j = 1; j < 5; j++){
		for (i = 1; i < 10; i++){
			var offset = 0;
			if (j > 2){ offset = 5;}
			if (j==1 || j==3){		
				startLine = gridToScreenPos(1,i+offset);
				endLine = gridToScreenPos(9,i+offset);
				if (i == 5){ i = 11;}
			}else if(j==2 || j==4){
				startLine = gridToScreenPos(i,1+offset);
				endLine = gridToScreenPos(i,5+offset);
			}
			drawLine(startLine.x,startLine.y,endLine.x,endLine.y,"black");
			if (j == 2){
				pos = gridToScreenPos(i+.3,0.6)
				drawText(i,pos.x,pos.y);
				pos = gridToScreenPos(i+.3,11)
				drawText(10-i,pos.x,pos.y);
			}
		}
		if (j == 1 || j ==2){
			var offset = 0;
			if (j == 2){ offset = 7;}
			palaceLineStart = gridToScreenPos(4,1+offset);
			palaceLineEnd =	gridToScreenPos(6,3+offset);
			drawLine(palaceLineStart.x,palaceLineStart.y,palaceLineEnd.x,palaceLineEnd.y,"red");
			palaceLineStart = gridToScreenPos(6,1+offset);
			palaceLineEnd =	gridToScreenPos(4,3+offset);
			drawLine(palaceLineStart.x,palaceLineStart.y,palaceLineEnd.x,palaceLineEnd.y,"red");
		}
	}
}
function init(){
	stage.addChild(container);
    inited = true;
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Touch.enable(stage);  
	drawBoard();
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true; 
	var startPos = {x:0, y:0};
	
	for (i = 0; i < 32; i++){
		var pieceType = getPieceName(i);
		chessPieces[i] = new ChessPiece(getPieceName(i),
										getStartingPosition(pieceType),
										new createjs.Sprite(piecesSheet, getPieceName(i)));
	}
}

var chessPieces = new Array(32);

function tick(event) {
	if (update){	
		for (i = 0; i < 32; i++){
			chessPieces[i].updatePiece();
		}
		update = false;
		stage.update(event);
	}
}