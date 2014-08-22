var soundlib = [[], [], []];

function setMusic(title)
{
	$('#musicMP3').attr('src', 'snd/music/' + title + '.mp3');
	$('#musicOGG').attr('src', 'snd/music/' + title + '.ogg');
	document.getElementById('music').load();
	document.getElementById('music').play();
};

function toggleMusicVolue(on)
{
	if(on)
	{
		$('#music').stop().animate({ volume: 1 }, 600, 'linear');
		$('#soundToggleButton img').attr('src', 'img/sound_on.png');
	}
	else
	{
		$('#music').stop().animate({ volume: 0 }, 600, 'linear');
		$('#soundToggleButton img').attr('src', 'img/sound_off.png');
	}
};

function setupSounds()
{
	for(var num = 0; num < 3; num++)
	{
		soundlib[0].push(new Audio('snd/tick.ogg'));
		soundlib[1].push(new Audio('snd/wrong.ogg'));
		soundlib[2].push(new Audio('snd/shot.ogg'));
	}
};

function playClickSound()
{
	for(var num = 0; num < soundlib[0].length; num++)
	if(soundlib[0][num].paused)
	{
		soundlib[0][num].play();
		break;
	}
};

function playErrorSound()
{
	for(var num = 0; num < soundlib[1].length; num++)
	if(soundlib[1][num].paused)
	{
		soundlib[1][num].play();
		break;
	}
};

function playShotSound(callback)
{
	for(var num = 0; num < soundlib[2].length; num++)
	if(soundlib[2][num].paused)
	{
		soundlib[2][num].play();
		if(callback) window.setTimeout(callback, 600);
		break;
	}
}

