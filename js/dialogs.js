function showDialog(selector)
{
	$(selector).show();
	$('#dialogLayer').show().css('opacity', '1');
}

function hideDialogs()
{
	$('#dialogLayer').css('opacity', '0');
	window.setTimeout(function()
	{
		$('#dialogBox .dialog').hide();
		$('#dialogLayer').attr('style', 'display: none; opacity: 0;');
	}, 200);
}
