var r;
var control_h = 40;
var drag = false;
var drag_x, drag_y;
var map_x, map_y;

function setupDragging()
{
	$(document.body).mousedown(function(e)
	{
		drag = true;
		drag_x = e.clientX;
		drag_y = e.clientY;
		map_x = -$(document).scrollLeft();
		map_y = -$(document).scrollTop();
	});
	$(document.body).mousemove(function(e)
	{
		if(drag && !$('#dialogLayer').is(":visible"))
		{
			var drag_x_result = map_x + e.clientX - drag_x;
			var drag_y_result = map_y + e.clientY - drag_y;
			$('html, body').animate({ scrollTop: -drag_y_result }, 0);
			$('html, body').animate({ scrollLeft: -drag_x_result }, 0);
		}
	});
	$(document.body).mouseup(function(e)
	{
		drag = false;
	});
};

$(window).ready(function()
{
	//setup Raphael
	r = new Raphael('map', WorldMap.width, WorldMap.height);
	
	//setup layout
	$('#map')
		.css('width', WorldMap.width)
		.css('height', WorldMap.height);
	$('#board')
		.css('width', $('#map').outerWidth())
		.css('height', $('#map').outerHeight() + $('#control').outerHeight());
    
    //setup SVG
	Map.setup(r);
	Risk.setup(r);
	
	//setup sounds
	setupSounds();
	
	//setup layers
    $('#board').hide();
    $('#setup').hide();
    
    //setup events
    $('#startButton').click(function()
    {
		playClickSound();
		$('#start').hide();
		$('#setup').show();
	});
    setupSetup();
	setupBoard();
	setupDragging();
	
	//setup theme
    $(document.body).css('background-color', 'white');
    $(document.body).css('background-image', WorldMap.texture);
    
    //load basic setup
    addPlayer();
    addPlayer();
});

