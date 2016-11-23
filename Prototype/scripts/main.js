/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "200px";
    $('.header img').css('margin-left', '170px');
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    $('.header img').css('margin-left', '0px');
}

function openNavRight() {
    document.getElementById("mySidenav2").style.width = "200px";
    document.getElementById("main").style.marginRight = "200px";
}

function closeNavRight() {
    document.getElementById("mySidenav2").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}

//to close the menu when the screen is tablet or smaller
$(window).resize(function() {
    if ($(window).width() < 768) {
        $('.sidenav').css({'width':'0'});
        $('#main').css({'marginLeft':'0'});
        $('.header img').css('margin-left', '0');
    }
    else {
        $('.sidenav').css({'width':'200px'});
        $('#main').css({'marginLeft':'200px'});
        $('.header img').css('margin-left', '170px');
    }
});

function calcPlantHeight(){
    //plant format is 6x3,5
    //so width  - 6
    //   height - 3,5
    var height = ($('#plant').parent().width() * 3.5) / 6;
    $('#plant').css({'height': height});
}
// $(document).ready(function(){
//     function fixPageXY(e) {
//       if (e.pageX == null && e.clientX != null ) { 
//         var html = document.documentElement;
//         var body = document.body;

//         e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0)
//         e.pageX -= html.clientLeft || 0
        
//         e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0)
//         e.pageY -= html.clientTop || 0
//       }
//     }

//     document.getElementById('lamp').onmousedown = function() {
//       this.style.position = 'absolute';

//       var self = this

//       document.onmousemove = function(e) {
//         e = e || event
//         fixPageXY(e)  
//         // put ball center under mouse pointer. 25 is half of width/height
//         self.style.left = e.pageX-25+'px' 
//         self.style.top = e.pageY-25+'px' 
//       }
//       this.onmouseup = function() {
//         document.onmousemove = null
//       }
//     }

// });





/* Equipment control popup box */

$(document).ready(function() {

    $('body').append('<div id="blackout"></div>');

    $('#main').prepend('<div id="equipmentBox"><div class="close">X</div><div class="top"><h2></h2></div><div class="bottom"></div></div>');

    $('#equipmentBox .bottom').append('Control stuff here');
     
    var boxWidth = 400;

    function centerBox() {
     
        var winWidth = $(window).width();
        var winHeight = $(document).height();
        var scrollPos = $(window).scrollTop();
         
         
        var disWidth = (winWidth - boxWidth) / 2;
        var disHeight = scrollPos + 150;
         
        $('#equipmentBox').css({'width' : boxWidth+'px', 'left' : disWidth+'px', 'top' : disHeight+'px'});
        $('#blackout').css({'width' : winWidth+'px', 'height' : winHeight+'px'});
         
        return false;       
    }
    
    $(window).resize(centerBox);
    $(window).scroll(centerBox);
    centerBox(); 

    $('.equipment').click(function(e) {
            
        e.preventDefault();
        e.stopPropagation();
         
        var scrollPos = $(window).scrollTop();
        
        $('#equipmentBox .top h2').html($(this).attr('id')+' - Equipment Control');
        $('#equipmentBox').show();
        $('#blackout').show();
        $('html,body').css('overflow', 'hidden');
         
        $('html').scrollTop(scrollPos);

    });

    $('html').click(function() { 
        var scrollPos = $(window).scrollTop();

        $('#equipmentBox').hide();
        $('#blackout').hide(); 
        $("html,body").css("overflow","initial");
        $('html').scrollTop(scrollPos);
    });

    $('.close').click(function() { 
        var scrollPos = $(window).scrollTop();

        $('#equipmentBox').hide();
        $('#blackout').hide(); 
        $("html,body").css("overflow","initial");
        $('html').scrollTop(scrollPos);
    });

});
