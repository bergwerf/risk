var tablerow = [
'<tr>',
'<td>',
	"<div class='blackbox player choice'>",
		'<span>Human</span>',
		"<div class='blackbox active left'>‹</div>",
		"<div class='blackbox active right'>›</div>",
	'</div>',
'</td>',
'<td>',
	"<div class='blackbox color choice' style='background-color: rgb(200, 0, 0);'>",
		"<div class='blackbox active left'>‹</div>",
		"<div class='blackbox active right'>›</div>",
	'</div>',
'</td>',
'<td>',
	"<div class='blackbox name choice'>",
		'<span>Campbell</span>',
		"<div class='blackbox active left'>‹</div>",
		"<div class='blackbox active right'>›</div>",
	'</div>',
'</td>',
"<td><div class='blackbox active remove' style='font-family: sans-serif;'>x</div></td>",
'</tr>'
].join('\n');
var playerTypes = [
'Human'
//,'Computer'
];

function addPlayer()
{
	var newrow = $('#players tbody tr:last').before(tablerow).prev();
	if($('#players tbody').children().size() > Risk.maxPlayers) $('#addPlayer').hide();
	newrow.find('.player .left').click(function(e)
	{
		playClickSound();
		var elm = e.target.parentNode.children[0];
		var player = getArrayPos(elm.innerHTML, playerTypes);
		player = player == 0 ? playerTypes.length - 1 : player - 1;
		elm.innerHTML = playerTypes[player];
	});
	newrow.find('.player .right').click(function(e)
	{
		playClickSound();
		var elm = e.target.parentNode.children[0];
		var player = getArrayPos(elm.innerHTML, playerTypes);
		player = player == playerTypes.length - 1 ? 0 : player + 1;
		elm.innerHTML = playerTypes[player];
	});
	newrow.find('.color .left').click(function(e)
	{
		playClickSound();
		var elm = e.target.parentNode;
		var color = getArrayPos(elm.style.backgroundColor, Risk.colors);
		color = color == 0 ? Risk.colors.length - 1 : color - 1;
		elm.style.backgroundColor = Risk.colors[color];
	});
	newrow.find('.color .right').click(function(e)
	{
		playClickSound();
		var elm = e.target.parentNode;
		var color = getArrayPos(elm.style.backgroundColor, Risk.colors);
		color = color == Risk.colors.length - 1 ? 0 : color + 1;
		elm.style.backgroundColor = Risk.colors[color];
	});
	newrow.find('.name .left').click(function(e)
	{
		playClickSound();
		var elm = e.target.parentNode.children[0];
		var name = getArrayPos(elm.innerHTML, Risk.names);
		name = name == 0 ? Risk.names.length - 1 : name - 1;
		elm.innerHTML = Risk.names[name];
	});
	newrow.find('.name .right').click(function(e)
	{
		playClickSound();
		var elm = e.target.parentNode.children[0];
		var name = getArrayPos(elm.innerHTML, Risk.names);
		name = name == Risk.names.length - 1 ? 0 : name + 1;
		elm.innerHTML = Risk.names[name];
	});
	newrow.find('.remove').click(function(e)
	{
		playClickSound();
		$(e.target.parentNode.parentNode).remove();
		$('#addPlayer').show();
	});
};

function setupGame()
{
	var colorsUsed = [];
	var namesUsed = [];
	Risk.players = [];
	var correct_input = true;
	while(colorsUsed.length < Risk.colors.length) colorsUsed.push(false);
	while(namesUsed.length < Risk.names.length) namesUsed.push(false);
	for(var num = 0; num < $('#players tbody').children().size() - 1; num++)
	{
		var current_row = $('#players tbody').children()[num];
		var current_color = current_row.children[1].children[0].style.backgroundColor;
		var current_name = current_row.children[2].children[0].children[0].innerHTML;
		if(colorsUsed[getArrayPos(current_color, Risk.colors)] == false)
			colorsUsed[getArrayPos(current_color, Risk.colors)] = true;
		else correct_input = false;
		if(namesUsed[getArrayPos(current_name, Risk.names)] == false)
			namesUsed[getArrayPos(current_name, Risk.names)] = true;
		else correct_input = false;
		if(current_row.children[0].children[0].children[0].innerHTML == 'Human')
			Risk.players.push(new human(current_color, current_name));
		else Risk.players.push(new computer(current_color, current_name));
	}
	if(correct_input && Risk.players.length > 1)
	{
		playClickSound();
		setMusic('play');
		//set interface
		$('#cardsButton').attr('class', 'controlButton inactive');
		$('#retreatButton').attr('class', 'controlButton active').hide();
		$('#throwButton').attr('class', 'controlButton active').hide();
		$('#endButton').hide();
		$('#setup').hide();
		$('#board').show();
		$(document.body).css('background-color', WorldMap.background);
		//load players into queue
		$('#queue').html('');
		$('#queue').css('width', (Risk.players.length - 1) * 10 + 100);
		for(var num = 0; num < Risk.players.length; num++)
		{
			$('#queue').append("<div class='player' style='background-color: " +
			Risk.players[num].color + "'>&nbsp;&nbsp;&nbsp;" + Risk.players[num].name + "&nbsp;&nbsp;&nbsp;</div>");
		}
		Risk.setActivePlayer(0);
		$('#messageBox').css('left', $('#queue').width());
		Risk.startGame();
	}
	else
	{
		playErrorSound();
		$('#players').css('background-color', 'red');
		setTimeout(function(){ $('#players').removeAttr('style'); }, 1000);
	}
};

function setupSetup()
{
	$('#addPlayer').click(function()
	{
		playClickSound();
		addPlayer();
	});
	$('#mission span').html(Risk.missions[Risk.mission]);
	$('#mission .left').click(function()
	{
		playClickSound();
		Risk.mission = Risk.mission == 0 ? Risk.missions.length - 1 : Risk.mission - 1;
		$('#mission span').html(Risk.missions[Risk.mission]);
	});
	$('#mission .right').click(function()
	{
		playClickSound();
		Risk.mission = Risk.mission == Risk.missions.length - 1 ? 0 : Risk.mission + 1;
		$('#mission span').html(Risk.missions[Risk.mission]);
	});
	$('#setupButton').click(setupGame);
	$('#cancelSetupButton').click(function()
	{
		playClickSound();
		$('#setup').hide();
		$('#start').show();
	});
};

function setupBoard()
{
	$('#throwButton').click(function()
	{
		if($(this).hasClass('inactive')) return;
		playClickSound();
		Risk.throwDice.call(Risk)
	});
	$('#retreatButton').click(function()
	{
		if($(this).hasClass('inactive')) return;
		playClickSound();
		Risk.endAttack(1);//1 = retreat
	});
	$('#cardsButton').click(function()
    {
		if($(this).hasClass('inactive')) return;
		playClickSound();
		showDialog('#cardsDialog');
	});
	$('#cardsDialog .trade').click(function()
    {
		if($(this).hasClass('inactive')) return;
		playClickSound();
		Risk.tradeCards();
	});
	$('#cardsDialog .ok').click(function()
    {
		if($(this).hasClass('inactive')) return;
		playClickSound();
		hideDialogs();
	});
	$('#endButton').click(function()
    {
		playClickSound();
		Risk.currentPlayer.endRound();
	});
	$('#menuButton').click(function()
    {
		playClickSound();
		//clear
		Map.clear();
		Risk.endGame();
		//set
		setMusic('start');
		toggleMusicVolue(true);
		$('#board').hide();
		$('#start').show();
		$(document.body).css('background-color', 'white');
	});
	$('#soundToggleButton').css('opacity', '1.0');
	$('#soundToggleButton').click(function()
    {
		playClickSound();
		if(document.getElementById('music').volume == 1) toggleMusicVolue(false);
		else toggleMusicVolue(true);
	});
};

