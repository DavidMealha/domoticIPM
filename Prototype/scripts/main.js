/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "200px";
    $('.header img').css('margin-left', '170px');

    //call the function that resizes the plant
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    $('.header img').css('margin-left', '0px');

    //call the function that resizes the plant
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

/* Equipment control popup box */
$(document).ready(function() {

    $('body').append('<div id="blackout"></div>');

    $('#main').prepend('<div id="equipmentBox"><div class="close">x</div><div class="top"><h2></h2></div><div class="currentStatus"></div>'+

'<ul class="nav nav-tabs"><li class="active"><a data-toggle="tab" href="#newSchedule">New Schedule</a></li><li><a data-toggle="tab" href="#currentSchedule">Current Schedule</a></li></ul><div class="tab-content"><div id="newSchedule" class="tab-pane fade in active"></div><div id="currentSchedule" class="tab-pane fade"></div></div>'

+'<div class="bottom"></div></div>');

    $('#equipmentBox .bottom').append('<button class="btn" onclick="$(\'.close\').click()">Schedule</button><a href="#" class="btn-cancel" onclick="$(\'.close\').click()">Cancel</a>');

    var boxWidth = 400;

    function centerBox() {
     
        var winWidth = $(window).width();
        var winHeight = $(document).height();
        var scrollPos = $(window).scrollTop();
         
         
        var disWidth = (winWidth - boxWidth) / 2;
        var disHeight = scrollPos + 70;
         
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
        
        //getting the equipment type, always the first class name
        var equipmentType = this.className.split(" ")[0];
        var equipmentIdTag = '#' + $(this).attr('id');
        var equipment = $(equipmentIdTag);
        var currentState = equipment.data("state");

        //setting the change state controls
        var optionsAC = "<option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option><option>24</option><option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option>";
        var optionsStove = "<option>90</option><option>120</option><option>150</option><option>180</option><option>210</option><option>240</option><option>270</option><option>300</option>";

        var btnMessage,statusMessage,spanColorTag, btnColorTag;
        if(currentState == "on"){
            if (equipmentType == "door") {
                btnMessage = "Close";
                statusMessage = "Currently Open - ";    
            }else{
                btnMessage = "Turn Off";
                statusMessage = "Currently ON - ";    
            }
            
            spanColorTag = "green";
            btnColorTag = "btn-red";
        }else{
             if (equipmentType == "door") {
                btnMessage = "Open";
                statusMessage = "Currently Closed - ";    
            }else{
                btnMessage = "Turn On";
                statusMessage = "Currently OFF - ";   
            }
            
            spanColorTag = "red";
            btnColorTag = "btn-green";
        }

        if (equipmentType == "ac") {
            $('#equipmentBox .currentStatus').html('<span id="currentStatusSpan" class="'+spanColorTag+'">'+statusMessage+'</span><a id="btn-change-state" class="btn '+btnColorTag+'" href="#">'+ btnMessage +'</a><div class="form-block"><label>Temperature:</label><select class="form-input">' + optionsAC + '</select></div>');
        } else if (equipmentType == "stove") {
            $('#equipmentBox .currentStatus').html('<span id="currentStatusSpan" class="'+spanColorTag+'">'+statusMessage+'</span><a id="btn-change-state" class="btn '+btnColorTag+'" href="#">'+ btnMessage +'</a><div class="form-block"><label>Temperature:</label><select class="form-input">' + optionsStove + '</select></div>');    
        }else{
            $('#equipmentBox .currentStatus').html('<span id="currentStatusSpan" class="'+spanColorTag+'">'+statusMessage+'</span><a id="btn-change-state" class="btn '+btnColorTag+'" href="#">'+ btnMessage +'</a>');
        }   

        //setting the new schedule controls
        var newScheduleElements = '<form>';
        if(equipmentType == "ac") {
            newScheduleElements += '<div class="form-block"><label>Temperature</label><select class="form-input">' + optionsAC+ '</select><span class="red"> *</span></div>';
        }else if (equipmentType == "stove") {
            newScheduleElements += '<div class="form-block"><label>Temperature</label><select class="form-input">' + optionsStove+ '</select><span class="red"> *</span></div>';
        }

        newScheduleElements += '<div class="form-block"><label>Day Of The Week</label><select class="form-input"><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option></select></div>'+
            '<div class="form-block"><label>Starting Hour</label><input type="time" class="form-input"><span class="red"> *</span></div>'+
            '<div class="form-block"><label>Duration</label><input type="number" class="form-input"><select class="form-input"><option>Hours</option><option>Minutes</option></select></div>'+
            '<div class="form-block"><label>Daily</label><input type="checkbox" class="form-input"></div><div><span class="red">* Required</span></div></form>';

        $('#equipmentBox div#newSchedule').html(newScheduleElements);

        //current schedule listing
        $('#equipmentBox div#currentSchedule').html('<ul class="list-group"><li class="list-group-item"><div>Daily - 8:00 - 22º <i id="scheduleDetails" class="glyphicon glyphicon-chevron-down" style="float: right;" onclick="openUpdateForm()"></i></div><div id="updateSchedule"></div></li></ul>');

        //on click of change state alter the visual state of the equipment
        $('#btn-change-state').unbind().click(function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            
            if (currentState == "off") {
                currentState = "on";
                equipment.data("state", "on");    
                equipment.attr("src", "images/" + equipmentType + "-on.png");

                ev.target.className = "btn btn-red";
                if (equipmentType == "door") {
                    $(ev.target).text("Close");
                    $('#currentStatusSpan').text('Currently Open - ').attr('class', 'green');
                }
                else
                {
                    $(ev.target).text("Turn Off");
                    $('#currentStatusSpan').text('Currently ON - ').attr('class', 'green');
                }
                

            }else{
                currentState = "off";
                equipment.data("state", "off"); 
                equipment.attr("src", "images/" + equipmentType + "-off.png");

                ev.target.className = "btn btn-green";
                if (equipmentType == "door") {
                    $(ev.target).text("Open");
                    $('#currentStatusSpan').text('Currently Closed - ').attr('class', 'red');
                }
                else
                {
                    $(ev.target).text("Turn On");
                    $('#currentStatusSpan').text('Currently OFF - ').attr('class', 'red');
                }
                
            }
        });

        $('#scheduleDetails').unbind().click(function(ev){
            $('#updateSchedule').html(newScheduleElements);
        });

        $('#equipmentBox .top h2').html($(this).attr('id')+' - Equipment Control');
        $('#equipmentBox').show();
        $('#blackout').show();
        $('html,body').css('overflow', 'hidden');
         
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
// Clicking anywhere outside of the popup box will close it

$(document).mouseup(function (e) {
    var popup = $('#equipmentBox');

    if (!popup.is(e.target) && popup.has(e.target).length == 0) {

        var scrollPos = $(window).scrollTop();
        $('#equipmentBox').hide();
        $('#blackout').hide(); 
        $("html,body").css("overflow","initial");
        $('html').scrollTop(scrollPos);

    }
});
