'use strict';
/**
*  coding by sylar   2017.07.15
*/
var cell = 30;
var size = 16;
var chessSize = 12;
var chessColors = ["#232323","#DEDEDE"];
var xOffset = cell;
var yOffset = cell;
var panelWidth = size * cell;
var panelHeight = size * cell;
var canvas;
var ctx;
var points;
var pointMap;
var currentPlayer = 1; //1 or 2
var eventAble = true;

/**
*初始化棋盘
*/
function initChessboard(){
	eventAble = true;
	canvas = document.getElementById('game_panel');
 	canvas.width = panelWidth + 2 * cell;
	canvas.height = panelHeight + 2 * cell;
	ctx = canvas.getContext("2d");

	ctx.fillStyle = "#989898";
	ctx.fillRect(cell, cell, panelWidth, panelHeight);

	ctx.fillStyle = "#343434";
	ctx.beginPath();

    for(var i = 0; i <= size; i++) {
    	ctx.moveTo(xOffset, cell * i + yOffset);
    	ctx.lineTo(cell * size + xOffset, cell * i + yOffset);
    	ctx.moveTo(cell * i + xOffset , yOffset);
    	ctx.lineTo(cell * i + xOffset, cell * size + yOffset);
    }

	ctx.lineWidth = 2; 
    ctx.stroke();
    ctx.closePath();
    addClickEvent(canvas);

    getAllPoint(cell, size, xOffset, yOffset);
    
}

/**
*获取棋盘上所有交点
*/
function getAllPoint(cell, size, xOffset, yOffset){
	points = [];
	pointMap = {};
	for(var i = 0; i <= size; i++) {
		var x = cell * i + xOffset;
		for(var j = 0; j<= size; j++) {
			var y = cell * j + yOffset;
			var point = {
				x:x,
				y:y,
				flag:null
			}
			points.push(point);
			pointMap[x+"-"+y] = point;
		}
	}
}


/**
*获取鼠标事件坐标
*/
function getEventPosition(e){
   var rect = canvas.getBoundingClientRect();   
    return {   
     x: e.clientX - rect.left * (canvas.width / rect.width),  
     y: e.clientY - rect.top * (canvas.height / rect.height)  
   };  
}

/**
*绘制棋子
*/
function drawChess(x,y,colorIndex,ctx){
	ctx.beginPath();
	ctx.arc(x, y, chessSize, 0, Math.PI*2, false);
	ctx.fillStyle=chessColors[colorIndex];
	ctx.fill();
	ctx.closePath();
}

/**
*绘制提示信息
*/
function drawAlertInfo(currentPlayer,ctx){
	ctx.beginPath();
	ctx.fillStyle = "#565656";
	var index = (size - 6) / 2;
    ctx.fillRect((index+1) * cell, (index+1) * cell, 6 * cell, 3 * cell);
    var text = (currentPlayer==1?"黑":"白")+"子胜利！";
    ctx.font = "24px serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, (index+2) * cell, (index+2) * cell);
    ctx.closePath();
}

/**
*下棋事件
*/
function addClickEvent(canvas){
	canvas.addEventListener("click",function(e){//给canvas添加点击事件
		if(!eventAble){
			return;
		}
	    var position = getEventPosition(e);
	    points.forEach(function(point){
            var point1 = {x:point.x-cell/2,y:point.y-cell/2};
            var point2 = {x:point.x+cell/2,y:point.y+cell/2};
            if(position.x>point1.x&&position.x<point2.x&&position.y>point1.y&&position.y<point2.y){
            	if(point.flag == null){
            	   var colorIndex = currentPlayer == 1 ? 0 : 1;
            	   drawChess(point.x, point.y, colorIndex, ctx);
            	   point.flag = currentPlayer;
            	   if(checkFiveSuccess(point)){
            	   		eventAble = false;
            	   		drawAlertInfo(currentPlayer,ctx);
            	   } 
            	   currentPlayer = currentPlayer == 1 ? 2 : 1;
            	}
            }
	    });
	});
}

/**
*重新开始
*/
var rebutton = function (){
	initChessboard();
}

/**
*检查棋子是否满足连续5个
*/
function checkFiveSuccess(currentPoint){
    var count = checkDerictChess(currentPoint,currentPoint,1,1);
    if(count >=5){return true;}else{ return false;}
}

/**
*递归检查棋子
*/
function checkDerictChess(cpoint,opoint,direct,count){
	var key = null;
	if(count >= 5){
		return count;
	}
	switch(direct){
		case 1://横向左
			key = cpoint.x-1*cell+"-"+cpoint.y;
			if (pointMap[key] && pointMap[key].flag == cpoint.flag){
				count++;
				return checkDerictChess(pointMap[key], opoint, direct, count);
			} else {
				return checkDerictChess(opoint, opoint, 2, count);
			}
			break;
		case 2://横向右
			key = cpoint.x+1*cell+"-"+cpoint.y;
			if (pointMap[key] && pointMap[key].flag == cpoint.flag){
				count++;
				return checkDerictChess(pointMap[key], opoint, direct, count);
			} else {
				return checkDerictChess(opoint, opoint, 3, 1);
			}
			break;
		case 3://纵向上
			key = cpoint.x+"-"+(cpoint.y-1*cell);
			if (pointMap[key] && pointMap[key].flag == cpoint.flag){
				count++;
				return checkDerictChess(pointMap[key], opoint, direct, count);
			} else {
				return checkDerictChess(opoint, opoint, 4, count);
			}
			break;
		case 4://纵向下
			key = cpoint.x+"-"+(cpoint.y+1*cell);
			if (pointMap[key] && pointMap[key].flag == cpoint.flag){
				count++;
				return checkDerictChess(pointMap[key], opoint, direct, count);
			} else {
				return checkDerictChess(opoint, opoint, 5, 1);
			}
			break;
		case 5://左斜上
		    key = cpoint.x-1*cell+"-"+(cpoint.y-1*cell);
			if (pointMap[key] && pointMap[key].flag == cpoint.flag){
				count++;
				return checkDerictChess(pointMap[key], opoint, direct, count);
			} else {
				return checkDerictChess(opoint, opoint, 6, count);
			}
			break;
		case 6://左斜下
		    key = cpoint.x+1*cell+"-"+(cpoint.y+1*cell);
			if (pointMap[key] && pointMap[key].flag == cpoint.flag){
				count++;
				return checkDerictChess(pointMap[key], opoint, direct, count);
			} else {
				return checkDerictChess(opoint, opoint, 7, 1);
			}
			break;
		case 7://右斜上
		    key = cpoint.x+1*cell+"-"+(cpoint.y-1*cell);
			if (pointMap[key] && pointMap[key].flag == cpoint.flag){
				count++;
				return checkDerictChess(pointMap[key], opoint, direct, count);
			} else {
				return checkDerictChess(opoint, opoint, 8, count);
			}
			break;
		case 8://右斜下
		    key = cpoint.x-1*cell+"-"+(cpoint.y+1*cell);
			if (pointMap[key] && pointMap[key].flag == cpoint.flag){
				count++;
				return checkDerictChess(pointMap[key], opoint, direct, count);
			} else {
				return count;
			}
			break;
		default: 
			break;
	}
	return count;
}


window.onload = initChessboard;
