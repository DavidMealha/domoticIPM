		var canvas, context, startX, endX, startY, endY;
        var mouseIsDown = 0;

        function init() {
            canvas = document.getElementById("canvas");
            context = canvas.getContext("2d");

			if (document.defaultView && document.defaultView.getComputedStyle) {
			this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
			this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
			this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
			this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
			}
			
            canvas.addEventListener("mousedown", mouseDown, false);
            canvas.addEventListener("mousemove", mouseXY, false);
            canvas.addEventListener("mouseup", mouseUp, false);
        }

        function mouseUp(eve) {
            if (mouseIsDown !== 0) {
                mouseIsDown = 0;
                var pos = getMousePos(canvas, eve);
                endX = pos.x;
                endY = pos.y;
                drawSquare(); //update on mouse-up
            }
        }

        function mouseDown(eve) {
            mouseIsDown = 1;
			var pos = getMousePos(canvas, eve);
			startX = endX = pos.x;
			startY = endY = pos.y;
			drawSquare(); //update
        }	

        function mouseXY(eve) {

            if (mouseIsDown !== 0) {
                var pos = getMousePos(canvas, eve);
                endX = pos.x;
                endY = pos.y;
                drawSquare();
            }
        }

        function drawSquare() {
            // creating a square
            var w = endX - startX;
            var h = endY - startY;
            var offsetX = (w < 0) ? w : 0;
            var offsetY = (h < 0) ? h : 0;
            var width = Math.abs(w);
            var height = Math.abs(h);
			var shapes = [];
			
			shape(startX + offsetX, startY + offsetY, width, height);
			
        }
		
		function shape(x,y,w,h){
			context.beginPath();
            context.rect(x, y, w, h);
            context.fillStyle = "yellow";
            context.fill();
            context.lineWidth = 7;
            context.strokeStyle = 'black';
            context.stroke();
		}
		

        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
		