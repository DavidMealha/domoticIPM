// Last updated November 2010 by Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Free to use and distribute at will
// So long as you are nice to people, etc

// This is a self-executing function that I added only to stop this
// new script from interfering with the old one. It's a good idea in general, but not
// something I wanted to go over during this tutorial

(function(window) {


// holds all our boxes
var boxes2 = []; 

// New, holds the 8 tiny boxes that will be our selection handles
// the selection handles will be in this order:
// 0  1  2
// 3     4
// 5  6  7
var selectionHandles = [];

// Hold canvas information
var canvas;
var ctx;
var WIDTH;
var HEIGHT;
var INTERVAL = 20;  // how often, in milliseconds, we check to see if a redraw is needed

var isDrag = false;
var isResizeDrag = false;
var expectResize = -1; // New, will save the # of the selection handle if the mouse is over one.
var mx, my; // mouse coordinates

 // when set to true, the canvas will redraw everything
 // invalidate() just sets this to false right now
 // we want to call invalidate() whenever we make a change
var canvasValid = false;

// The node (if any) being selected.
// If in the future we want to select multiple objects, this will get turned into an array
var mySel = null;

// The selection color and width. Right now we have a red selection with a small width
var mySelColor = '#CC0000';
var mySelWidth = 2;
var mySelBoxColor = 'darkred'; // New for selection boxes
var mySelBoxSize = 6;

// we use a fake canvas to draw individual shapes for selection testing
var ghostcanvas;
var gctx; // fake canvas context

// since we can drag from anywhere in a node
// instead of just its x/y corner, we need to save
// the offset of the mouse when we start dragging.
var offsetx, offsety;

//attributes to canvas - equipment
var canvas1;
var canvas2;
var contexts=[]; 
var states=[];
var imgAC=new Image();
var imgLAMP = new Image();
var imgDOOR = new Image();
var imgTV = new Image();
var imgEST = new Image();
var imgFOG = new Image();


// Padding and border style widths for mouse offsets
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

// Box object to hold data
function Box2() {
  this.x = 0;
  this.y = 0;
  this.w = 1; // default width and height?
  this.h = 1;
  this.fill = '#FFFFFF';
}

// New methods on the Box class
Box2.prototype = {
  // we used to have a solo draw function
  // but now each box is responsible for its own drawing
  // mainDraw() will call this with the normal canvas
  // myDown will call this with the ghost canvas with 'black'
  draw: function(context, optionalColor) {
      if (context === gctx) {
        context.fillStyle = 'black'; // always want black for the ghost canvas
      } else {
        context.fillStyle = this.fill;
      }
      
      // We can skip the drawing of elements that have moved off the screen:
      if (this.x > WIDTH || this.y > HEIGHT) return; 
      if (this.x + this.w < 0 || this.y + this.h < 0) return;
      
	 
      context.fillRect(this.x,this.y,this.w,this.h);
	  
      
    // draw selection
    // this is a stroke along the box and also 8 new selection handles
    if (mySel === this) {
      context.strokeStyle = mySelColor;
      context.lineWidth = mySelWidth;
      context.strokeRect(this.x,this.y,this.w,this.h);
      
      // draw the boxes
      
      var half = mySelBoxSize / 2;
      
      // 0  1  2
      // 3     4
      // 5  6  7
      
      // top left, middle, right
      selectionHandles[0].x = this.x-half;
      selectionHandles[0].y = this.y-half;
      
      selectionHandles[1].x = this.x+this.w/2-half;
      selectionHandles[1].y = this.y-half;
      
      selectionHandles[2].x = this.x+this.w-half;
      selectionHandles[2].y = this.y-half;
      
      //middle left
      selectionHandles[3].x = this.x-half;
      selectionHandles[3].y = this.y+this.h/2-half;
      
      //middle right
      selectionHandles[4].x = this.x+this.w-half;
      selectionHandles[4].y = this.y+this.h/2-half;
      
      //bottom left, middle, right
      selectionHandles[6].x = this.x+this.w/2-half;
      selectionHandles[6].y = this.y+this.h-half;
      
      selectionHandles[5].x = this.x-half;
      selectionHandles[5].y = this.y+this.h-half;
      
      selectionHandles[7].x = this.x+this.w-half;
      selectionHandles[7].y = this.y+this.h-half;

      
      context.fillStyle = mySelBoxColor;
      for (var i = 0; i < 8; i ++) {
        var cur = selectionHandles[i];
        context.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
      }
    }
    
  } // end draw

}

//Initialize a new Box, add it, and invalidate the canvas
function addRect(x, y, w, h, fill) {
  var rect = new Box2;
  rect.x = x;
  rect.y = y;
  rect.w = w
  rect.h = h;
  rect.fill = fill;
  boxes2.push(rect);
  invalidate();
}

function images(){
	imgAC.onload=function(){
		states.push(addState(0,15,imgAC));
	}
	imgAC.src="img-canvas/ac-off-hover.png";
	
	imgLAMP.onload=function(){
		states.push(addState(63,2,imgLAMP));
	}
	imgLAMP.src="img-canvas/lamp-off-hover (2).png";
	
	imgDOOR.onload=function(){
		states.push(addState(100,2,imgDOOR));
	}
	imgDOOR.src="img-canvas/door-on.png";
	
	imgTV.onload=function(){
		states.push(addState(140,2,imgTV));
	}
	imgTV.src="img-canvas/tv-on-hover.png";
	
	imgEST.onload=function(){
		states.push(addState(200,2,imgEST));
	}
	imgEST.src="img-canvas/meioAberto.png";
	
	imgFOG.onload=function(){
		states.push(addState(260,2,imgFOG));
	}
	imgFOG.src="img-canvas/stove-off.png";
}

// initialize our canvas, add a ghost canvas, set draw loop
// then add everything we want to intially exist on the canvas
function init2() {
	
  var isequipments = true;
  var i = 0;
  document.getElementById('cont').style.visibility = "visible";
  document.getElementById('cont1').style.visibility = "hidden";
  
  document.getElementById("buttoncanvas").onclick=function(){
	    if(isequipments){
			isequipments=false;
			document.getElementById('cont1').style.visibility = "visible";
			document.getElementById('buttoncanvas').value = "Introdução de Divisões";
			canvas1 = document.getElementById("cvs1");
			canvas2 = document.getElementById("cvs2");
			contexts.push(canvas1.getContext("2d"));
			contexts.push(canvas2.getContext("2d"));
			canvas1.onclick=function(e){ handleClick(e,1); };
			canvas2.onclick=function(e){ handleClick(e,2); };
			canvas1.onmousemove = function(e){ handleMousemove(e,1); }
			canvas2.onmousemove = function(e){ handleMousemove(e,2); }
			 images();			
		}else{
			document.getElementById('buttoncanvas').value = "Introdução de Equipamentos";
			document.getElementById('cont1').style.visibility = "visible";
			document.getElementById('').style.visibility = "hidden";
			isequipments = true;
			 canvas.onmousedown = myDown;
			 canvas.onmouseup = myUp;
			 canvas.ondblclick = myDblClick;
			 canvas.onmousemove = myMove;
				
		}
	 
  };
  
	  // add custom initialization here:
	  canvas = document.getElementById('cvs2');
	  HEIGHT = canvas.height;
	  WIDTH = canvas.width;
	  ctx = canvas.getContext('2d');
	  ghostcanvas = document.createElement('canvas');
	  ghostcanvas.height = HEIGHT;
	  ghostcanvas.width = WIDTH;
	  gctx = ghostcanvas.getContext('2d');
	  //fixes a problem where double clicking causes text to get selected on the canvas
	  canvas.onselectstart = function () { return false; }
	  
	  // fixes mouse co-ordinate problems when there's a border or padding
	  // see getMouse for more detail
	  if (document.defaultView && document.defaultView.getComputedStyle) {
		stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)     || 0;
		stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)      || 0;
		styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
		styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)  || 0;
	  }
	  
	  // make mainDraw() fire every INTERVAL milliseconds
	  setInterval(mainDraw, INTERVAL);
	  
	  // set our events. Up and down are for dragging,
	  // double click is for making new boxes
	  canvas.onmousedown = myDown;
	  canvas.onmouseup = myUp;
	  canvas.ondblclick = myDblClick;
	  canvas.onmousemove = myMove;
			 // set up the selection handle boxes
	  for (var i = 0; i < 8; i ++) {
		var rect = new Box2;
		selectionHandles.push(rect);
	  }
			// add a large green rectangle
	  addRect(260, 70, 60, 65, 'rgb(200,200,200)');
	  
	  // add a green-blue rectangle
	  addRect(240, 120, 40, 40, 'rgb(200,200,200)');  
	  
	  // add a smaller purple rectangle
	  addRect(45, 60, 25, 25, 'rgb(200,200,200)');
				
  
  
}


//wipes the canvas context
function clear(c) {
  c.clearRect(0, 0, WIDTH, HEIGHT);
}

// Main draw loop.
// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
function mainDraw() {
  if (canvasValid == false) {
    clear(ctx);
    
    // Add stuff you want drawn in the background all the time here
    
    // draw all boxes
    var l = boxes2.length;
    for (var i = 0; i < l; i++) {
      boxes2[i].draw(ctx); // we used to call drawshape, but now each box draws itself
    }
    
    // Add stuff you want drawn on top all the time here
    
    canvasValid = true;
  }
}

// Happens when the mouse is moving inside the canvas
function myMove(e){
  if (isDrag) {
    getMouse(e);
    
    mySel.x = mx - offsetx;
    mySel.y = my - offsety;   
    
    // something is changing position so we better invalidate the canvas!
    invalidate();
  } else if (isResizeDrag) {
    // time ro resize!
    var oldx = mySel.x;
    var oldy = mySel.y;
    
    // 0  1  2
    // 3     4
    // 5  6  7
    switch (expectResize) {
      case 0:
        mySel.x = mx;
        mySel.y = my;
        mySel.w += oldx - mx;
        mySel.h += oldy - my;
        break;
      case 1:
        mySel.y = my;
        mySel.h += oldy - my;
        break;
      case 2:
        mySel.y = my;
        mySel.w = mx - oldx;
        mySel.h += oldy - my;
        break;
      case 3:
        mySel.x = mx;
        mySel.w += oldx - mx;
        break;
      case 4:
        mySel.w = mx - oldx;
        break;
      case 5:
        mySel.x = mx;
        mySel.w += oldx - mx;
        mySel.h = my - oldy;
        break;
      case 6:
        mySel.h = my - oldy;
        break;
      case 7:
        mySel.w = mx - oldx;
        mySel.h = my - oldy;
        break;
    }
    
    invalidate();
  }
  
  getMouse(e);
  // if there's a selection see if we grabbed one of the selection handles
  if (mySel !== null && !isResizeDrag) {
    for (var i = 0; i < 8; i++) {
      // 0  1  2
      // 3     4
      // 5  6  7
      
      var cur = selectionHandles[i];
      
      // we dont need to use the ghost context because
      // selection handles will always be rectangles
      if (mx >= cur.x && mx <= cur.x + mySelBoxSize &&
          my >= cur.y && my <= cur.y + mySelBoxSize) {
        // we found one!
        expectResize = i;
        invalidate();
        
        switch (i) {
          case 0:
            this.style.cursor='nw-resize';
            break;
          case 1:
            this.style.cursor='n-resize';
            break;
          case 2:
            this.style.cursor='ne-resize';
            break;
          case 3:
            this.style.cursor='w-resize';
            break;
          case 4:
            this.style.cursor='e-resize';
            break;
          case 5:
            this.style.cursor='sw-resize';
            break;
          case 6:
            this.style.cursor='s-resize';
            break;
          case 7:
            this.style.cursor='se-resize';
            break;
        }
        return;
      }
      
    }
    // not over a selection box, return to normal
    isResizeDrag = false;
    expectResize = -1;
    this.style.cursor='auto';
  }
  
}

// Happens when the mouse is clicked in the canvas
function myDown(e){
  getMouse(e);
  
  //we are over a selection box
  if (expectResize !== -1) {
    isResizeDrag = true;
    return;
  }
  
  clear(gctx);
  var l = boxes2.length;
  for (var i = l-1; i >= 0; i--) {
    // draw shape onto ghost context
    boxes2[i].draw(gctx, 'black');
    
    // get image data at the mouse x,y pixel
    var imageData = gctx.getImageData(mx, my, 1, 1);
    var index = (mx + my * imageData.width) * 4;
    
    // if the mouse pixel exists, select and break
    if (imageData.data[3] > 0) {
      mySel = boxes2[i];
      offsetx = mx - mySel.x;
      offsety = my - mySel.y;
      mySel.x = mx - offsetx;
      mySel.y = my - offsety;
      isDrag = true;
      
      invalidate();
      clear(gctx);
      return;
    }
    
  }
  // havent returned means we have selected nothing
  mySel = null;
  // clear the ghost canvas for next time
  clear(gctx);
  // invalidate because we might need the selection border to disappear
  invalidate();
}

function myUp(){
  isDrag = false;
  isResizeDrag = false;
  expectResize = -1;
}

// adds a new node
function myDblClick(e) {
  getMouse(e);
  // for this method width and height determine the starting X and Y, too.
  // so I left them as vars in case someone wanted to make them args for something and copy this code
  var width = 40;
  var height = 40;
  //addRect(mx - (width / 2), my - (height / 2), width, height, 'rgba(0,205,0,0.7)');
  addRect(mx - (width / 2), my - (height / 2), width, height, 'rgb(200,200,200)');
}


function invalidate() {
  canvasValid = false;
}

// Sets mx,my to the mouse position relative to the canvas
// unfortunately this can be tricky, we have to worry about padding and borders
function getMouse(e) {
      var element = canvas, offsetX = 0, offsetY = 0;

      if (element.offsetParent) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }

      // Add padding and border style widths to offset
      offsetX += stylePaddingLeft;
      offsetY += stylePaddingTop;

      offsetX += styleBorderLeft;
      offsetY += styleBorderTop;

      mx = e.pageX - offsetX;
      my = e.pageY - offsetY
}

		function clearAll(){
            //Clear both canvas first
            canvas1.width = canvas1.width
            //canvas2.width = canvas2.width
        }

        function handleClick(e,contextIndex){
            e.stopPropagation();

            var mouseX=parseInt(e.clientX-e.target.offsetLeft);
            var mouseY=parseInt(e.clientY-e.target.offsetTop);

            clearAll();

            for(var i=0;i<states.length;i++){

                var state=states[i];

                if(state.dragging){
                    state.dragging=false;
                    state.draw();
                    continue;
                }

                if ( state.contextIndex==contextIndex
                    && mouseX>state.x && mouseX<state.x+state.width
                    && mouseY>state.y && mouseY<state.y+state.height)
                {
                    state.dragging=true;
                    state.offsetX=mouseX-state.x;
                    state.offsetY=mouseY-state.y;
                    state.contextIndex=contextIndex;
                }

                state.draw();
            }
        }
		
        function handleMousemove(e,contextIndex){
            e.stopPropagation();

            var mouseX=parseInt(e.clientX-e.target.offsetLeft);
            var mouseY=parseInt(e.clientY-e.target.offsetTop);
			var drawabled = false;

            clearAll();

            for(var i=0;i<states.length;i++){

                var state=states[i];

                if (state.dragging) {
                    state.x = mouseX-state.offsetX;
                    state.y = mouseY-state.offsetY;
                    state.contextIndex=contextIndex;
					drawabled = true;
                }
                state.draw();
				
            }
			
			if(drawabled){
				states.push(addState(0,15,imgAC));
				states.push(addState(63,2,imgLAMP));
				states.push(addState(100,2,imgDOOR));
				states.push(addState(140,2,imgTV));
				states.push(addState(200,2,imgEST));
				states.push(addState(260,2,imgFOG));
				
			}
			
			
        }

		function addState(x,y,image){
                state = {}
                state.dragging=false;
                state.contextIndex=1;
                state.image=image;
                state.x=x;
                state.y=y;
                state.width=image.width;
                state.height=image.height;
                state.offsetX=0;
                state.offsetY=0;
                state.draw=function(){
                    var context=contexts[this.contextIndex-1];
                    if (this.dragging) {
                        context.strokeStyle = 'white';
                        context.strokeRect(this.x,this.y,this.width+5,this.height+5)
                    }
                    context.drawImage(this.image,this.x,this.y);
                }
                state.draw();
                return(state);
        }
	

// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
//init();
window.init2 = init2;  

window.onload=function(){
	init2();
}
              
})(window);

