  //  	var canvas, context, startX, endX, startY, endY;
  //   var mouseIsDown = 0;

  //   function init() {
  //       canvas = document.getElementById("canvas");
  //       context = canvas.getContext("2d");

		// // if (document.defaultView && document.defaultView.getComputedStyle) {
		// // this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
		// // this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
		// // this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
		// // this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
		// // }
		
  //       // canvas.addEventListener("mousedown", mouseDown, false);
  //       // canvas.addEventListener("mousemove", mouseXY, false);
  //       // canvas.addEventListener("mouseup", mouseUp, false);

  //       //adding lamp just to test
  //       var img = new Image();
  //       img.onload = function(){
  //           context.drawImage(img, 0,0);
  //       };
  //       img.src = "images/movimentoOn.png";


  //   }

  //       function mouseUp(eve) {
  //           if (mouseIsDown !== 0) {
  //               mouseIsDown = 0;
  //               var pos = getMousePos(canvas, eve);
  //               endX = pos.x;
  //               endY = pos.y;
  //               drawSquare(); //update on mouse-up
  //           }
  //       }

  //       function mouseDown(eve) {
  //           mouseIsDown = 1;
		// 	var pos = getMousePos(canvas, eve);
		// 	startX = endX = pos.x;
		// 	startY = endY = pos.y;
		// 	drawSquare(); //update
  //       }	

  //       function mouseXY(eve) {

  //           if (mouseIsDown !== 0) {
  //               var pos = getMousePos(canvas, eve);
  //               endX = pos.x;
  //               endY = pos.y;
  //               drawSquare();
  //           }
  //       }

  //       function drawSquare() {
  //           // creating a square
  //           var w = endX - startX;
  //           var h = endY - startY;
  //           var offsetX = (w < 0) ? w : 0;
  //           var offsetY = (h < 0) ? h : 0;
  //           var width = Math.abs(w);
  //           var height = Math.abs(h);
		// 	var shapes = [];
			
		// 	shape(startX + offsetX, startY + offsetY, width, height);
			
  //       }
		
		// function shape(x,y,w,h){
		// 	context.beginPath();
  //           context.rect(x, y, w, h);
  //           context.fillStyle = "white";
  //           context.fill();
  //           context.lineWidth = 1;
  //           context.strokeStyle = 'black';
  //           context.stroke();
		// }
		

  //       function getMousePos(canvas, evt) {
  //           var rect = canvas.getBoundingClientRect();
  //           var canvasOffset=$("#canvas").offset();
  //           var offsetX=canvasOffset.left;
  //           var offsetY=canvasOffset.top;
  //           return {
  //               x: evt.clientX - offsetX,
  //               y: evt.clientY - offsetY
  //           };
  //       }

$(function(){

    var canvas, context, startX, endX, startY, endY;
    
    //com multiplas imagens e selecionando
    //http://jsfiddle.net/m1erickson/3KqgX/

    var img = new Image();
    img.onload = function(){
        context.drawImage(img, 0,0);
    };
    img.src = "images/movimentoOn.png";

    var img2 = new Image();
    img2.onload = function(){
        context.drawImage(img2, 100,0);
    };
    img2.src = "images/ac.png";

    var canvas=document.getElementById("canvas");
    var context=canvas.getContext("2d");
    var canvasOffset=$("#canvas").offset();
    var offsetX=canvasOffset.left;
    var offsetY=canvasOffset.top;
    var canvasWidth=canvas.width;
    var canvasHeight=canvas.height;
    var isDragging=false;

    function handleMouseDown(e){
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
      // set the drag flag
      isDragging=true;
    }

    function handleMouseUp(e){
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
      // clear the drag flag
      isDragging=false;
    }

    function handleMouseOut(e){
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
      // user has left the canvas, so clear the drag flag
      //isDragging=false;
    }

    function handleMouseMove(e){
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
      // if the drag flag is set, clear the canvas and draw the image
      if(isDragging){
          context.clearRect(0,0,canvasWidth,canvasHeight);
          context.drawImage(img,canMouseX-128/2,canMouseY-120/2,128,120);
      }
    }

    $("#canvas").mousedown(function(e){handleMouseDown(e);});
    $("#canvas").mousemove(function(e){handleMouseMove(e);});
    $("#canvas").mouseup(function(e){handleMouseUp(e);});
    $("#canvas").mouseout(function(e){handleMouseOut(e);});

});
		