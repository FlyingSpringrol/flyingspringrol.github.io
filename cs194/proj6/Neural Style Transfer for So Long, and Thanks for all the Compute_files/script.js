$(document).ready(function(){
    console.log('Loaded');

    let imgHeight = $(".hoverable").height();
    $(".hoverable").mousemove(getMousePosition);

    function getMousePosition(e) {
        let offset = $(this).offset();
        let y = e.pageY - offset.top;
        console.log("offset.top: " + offset.top)
        console.log("y: " + y)
        stride = imgHeight/12 + 10;
        console.log("stride: " + stride)

        if (y <= stride) {
            $( '.hoverable' ).attr("src","images/lego2/0.png");
        } else if (y <= stride*2) {
            $( '.hoverable' ).attr("src","images/lego2/1.png");
        } else if (y <= stride*3) {
            $( '.hoverable' ).attr("src","images/lego2/2.png");
        } else if (y <= stride*4) {
            $( '.hoverable' ).attr("src","images/lego2/3.png");
        } else if (y <= stride*5) {
            $( '.hoverable' ).attr("src","images/lego2/4.png");
        } else if (y <= stride*6) {
            $( '.hoverable' ).attr("src","images/lego2/5.png");
        } else if (y <= stride*7) {
            $( '.hoverable' ).attr("src","images/lego2/6.png");
        } else if (y <= stride*8) {
            $( '.hoverable' ).attr("src","images/lego2/7.png");
        } else if (y <= stride*9) {
            $( '.hoverable' ).attr("src","images/lego2/8.png");
        } else if (y <= stride*10) {
            $( '.hoverable' ).attr("src","images/lego2/9.png");
        } else if (y <= stride*11) {
            $( '.hoverable' ).attr("src","images/lego2/10.png");
        } else {
            $( '.hoverable' ).attr("src","images/lego2/11.png");
        }

    }

});