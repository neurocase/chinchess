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

var sceneSize = 600;
var boardOffset = {x: 100, y:60};
var sScale = (sceneSize / 20);

var debugCoords = false;

var chessPiece = function(team,piece,startPos){
	var pieceType = "red_soldier";
	var sprite = new createjs.Sprite(piecesSheet, pieceType);
	sprite.x = sprite.y = 50;
	container.addChild(sprite);
	sprite.on("pressmove", function (evt) {
		mousePos = {x: evt.stageX, y: evt.stageY};
		this.x = mousePos.x;
		this.y = mousePos.y;
		wtg = getWorldSpaceToNearestGrid(this.x,this.y);
		update = true;
	});

};
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
	var startLine = {x:0,y:0};
	var endLine = {x:0,y:0};
	for (j = 1; j < 5; j++){
		for (i = 1; i < 11; i++){
			var offset = 0;
			if (j > 2){ offset = 6;}
			if (j==1 || j==3){		
				startLine = gridToScreenPos(1,i+offset);
				endLine = gridToScreenPos(10,i+offset);
				if (i == 5){ i = 11;}
			}else if(j==2 || j==4){
				startLine = gridToScreenPos(i,1+offset);
				endLine = gridToScreenPos(i,5+offset);
			}
			drawLine(startLine.x,startLine.y,endLine.x,endLine.y,"black");
			
		}
		if (j == 1 || j ==2){
			var offset = 0;
			if (j == 2){ offset = 8;}
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
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true; 
	var startPos = {x:0, y:0};
	var ch = new chessPiece("red","solder",startPos);
	var pieceType = "red_soldier";
	//var piece = new createjs.Sprite(piecesSheet, pieceType);
	//piece.x = piece.y = 50;
	//container.addChild(piece);
	drawBoard();

}

function tick(event) {
	update = false;
	stage.update(event);
}