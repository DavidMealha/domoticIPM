/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    $('.header img').css('margin-left', '220px');
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    $('.header img').css('margin-left', '0px');
}

function openNavRight() {
    document.getElementById("mySidenav2").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px";
}

function closeNavRight() {
    document.getElementById("mySidenav2").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}