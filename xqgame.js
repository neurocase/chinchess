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
		red_rook:4, 
		red_cannon:5, 
		red_soldier:6,
		
		black_general:7, 
		black_advisor:8, 
		black_horse:9, 
		black_elephant:10,
		black_rook:11,
		black_cannon:12, 
		black_soldier:13
	}
};

var piecesSheet = new createjs.SpriteSheet(piecesData);
var container = new createjs.Container();


// 1 General, 2 Advisors, 2 Horses, 2 Cannons, 2 Rooks, 5 Soldiers

function getPieceName(n){
	if (n < 5){
		return "soldier";	
	}else if( n < 7){
		return "rook";	
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
//4,7: 1,3,5,7,9 -> Soldier
//3,8: 2,8 Cannon
//1,10
//1,9 ->Rook
//2,8 horse
//eleph 3,7
// 5 gen
// 4,6 advisor

var red_count ={
		soldier: 0,
		cannon: 0,
		rook: 0,
		horse: 0,
		elephant: 0,
		advisor: 0,
		general: 0
}
var black_count ={
		soldier: 0,
		cannon: 0,
		rook: 0,
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
		case "rook":
			retVal = count.rook * 8 + 1;
			count.rook++;
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

function createPieces(){
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
	   // console.log("Press Move");
		// indicate that the stage should be updated on the next tick:
		update = true;
	});
	piece.on("rollover", function (evt) {
		this.scale =  1.2;
	 //   update = true;
	});
	piece.on("rollout", function (evt) {
		 this.scaleX = piece.scaleY =  1;
		update = true;
	});
		var startPos = getStartingPosition(pieceType);
		startPos = getGridPos(startPos.x, startPos.y);
		console.log(startPos);
			piece.x = startPos.x;
			piece.y = startPos.y;
	}
}

circle = new createjs.Shape();
var g = new createjs.Graphics();

function getGridPos(i,j){
	i--;
	j--;
	var pos = {x:0,y:0};
	pos.x = boardOffset.x + i * (sceneSize / 11);
	pos.y = boardOffset.y + j * (sceneSize / 11);

	if (j > 4){
		pos.y = pos.y + sScale;	
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
	
	
	palaceLineStart = getGridPos(4,1);
	palaceLineEnd =	getGridPos(6,3);
	drawLine(palaceLineStart.x,palaceLineStart.y,palaceLineEnd.x,palaceLineEnd.y,"red");
	palaceLineStart = getGridPos(6,1);
	palaceLineEnd =	getGridPos(4,3);
	drawLine(palaceLineStart.x,palaceLineStart.y,palaceLineEnd.x,palaceLineEnd.y,"red");
	
	palaceLineStart = getGridPos(4,8);
	palaceLineEnd =	getGridPos(6,10);
	drawLine(palaceLineStart.x,palaceLineStart.y,palaceLineEnd.x,palaceLineEnd.y,"red");
	palaceLineStart = getGridPos(6,8);
	palaceLineEnd =	getGridPos(4,10);
	drawLine(palaceLineStart.x,palaceLineStart.y,palaceLineEnd.x,palaceLineEnd.y,"red");
	
	
	for (i = 0; i < 9; i++){
		for (j = 0; j < 10; j++){
			var extend = {x: 0, y:0};
			// extend: draw lines positive and negative from grid position: 0 = do both, 1 = positive only, -1 = negative only
			var pos = {x: 0, y:0};
			
			pos = getGridPos(i+1,j+1);
			
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
