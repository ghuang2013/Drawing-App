var Drawing_App = (function(){
    var $canvas = $("canvas");
    var context = $canvas[0].getContext("2d");
    var mouseDown = false;
    var erase = false;
    var thickness = 5;
    
    $listItem = $('ul#colorpicker>li');
    $erase = $('#erase');
    $thickness = $('#thickness');
    $option = $('#option');
    $moreOption = $('#moreOption');
    $save = $('#save');
    
    function coord(x,y){
        this.x = x;
        this.y = y;
    }
    
    function init(){
        testWindowSize();
        event();
        $(window).resize(testWindowSize);

        $listItem.each(function () {
            var color = $(this).attr('id');
            $(this).css("background-color", color);
        });
    }
    
    function event(){
        $listItem.on('click', function () {
            erase = false;
            findAndRemoveClass($(this));
            $(this).addClass('selected');
        });

        $erase.on('click', function () {
            findAndRemoveClass($listItem);
            erase = true;
        });

        $thickness.on('change', function () {
            thickness = $(this).val();
        });

        $option.on('click', function () {
            $moreOption.toggle();
        });
        
        $save.click(function () {
            var dt = canvas.toDataURL('image/png');
            this.href = dt;
        });
        
        $canvas.mousedown(mouseStartDraw).mousemove(mouseDrawing).mouseup(reset).mouseleave(reset);
        
        $canvas.touchstart(touchStartDraw).touchmove(touchDrawing).touchend(reset);
    }

    function testWindowSize() {
        if ($(window).width() < 980) {
            canvas.width = 495;
            canvas.height = 300;
        }
        else {
            canvas.width = 850;
            canvas.height = 400;
        }
    }
    
    function reset() {
        mouseDown = false;
    }

    function findAndRemoveClass(object) {
        $lastSelected = object.siblings('.selected');
        $lastSelected.removeClass('selected');
    }
    
    function getTouchCoord(e, $this){
        e = e.originalEvent;
        var x = e.changedTouches[0].pageX - $this.offset().left;
        var y = e.changedTouches[0].pageY - $this.offset().top;
        return new coord(x,y);
    }
    
    function touchStartDraw(e){
        var coord = getTouchCoord(e, $(this));
        startDraw(coord.x,coord.y);
    }
    
    function touchDrawing(e){
        e.preventDefault();
        var coord = getTouchCoord(e, $(this));
        drawing(coord.x,coord.y);
    }
    
    function mouseStartDraw(e){
        var x= e.offsetX;
        var y = e.offsetY;
        startDraw(x,y);
    }
    
    function mouseDrawing(e){
        var x= e.offsetX;
        var y = e.offsetY;
        drawing(x,y);
    }

    function startDraw(x,y) {
        context.beginPath();
        context.moveTo(x, y);
        mouseDown = true;
    }

    function drawing(x,y) {
        if (mouseDown) {
            context.lineTo(x,y);
            var color;
            if (!erase) {
                context.lineWidth = thickness;
                color = $(".selected").css("background-color");
            }
            else {
                color = 'white';
                context.lineWidth = 20;
            }
            context.strokeStyle = color;
            context.stroke();
        }
    }
    
    return{
        init:init
    }
})();

Drawing_App.init();