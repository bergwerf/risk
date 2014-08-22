function dice(x, y, _w, _h, r)
{
	var w = _w;
	var h = _h;
	var eyeRadius = w / 12;
	var rect = r.rect(0, 0, w, h, w / 4).attr({
		'fill': '#fff',
		'stroke': '#f00',
		'stroke-width': 0
	});
	var glow = rect.glow({ 'color': '#ff0', 'opacity': 1 }).attr('stroke-opacity', 0);
	var eyes = [
		r.circle(0, 0, eyeRadius).attr({ 'fill': '#000', 'stroke-width': 0 }),
		r.circle(0, 0, eyeRadius).attr({ 'fill': '#000', 'stroke-width': 0 }),
		r.circle(0, 0, eyeRadius).attr({ 'fill': '#000', 'stroke-width': 0 }),
		r.circle(0, 0, eyeRadius).attr({ 'fill': '#000', 'stroke-width': 0 }),
		r.circle(0, 0, eyeRadius).attr({ 'fill': '#000', 'stroke-width': 0 }),
		r.circle(0, 0, eyeRadius).attr({ 'fill': '#000', 'stroke-width': 0 }),
		r.circle(0, 0, eyeRadius).attr({ 'fill': '#000', 'stroke-width': 0 })
	];

	this.replace = function(x, y)
	{
		rect.attr({
			'x': x,
			'y': y
		});
		glow.transform('t' + x + ',' + y);
		for(var num = 0; num < 3; num++)
		{
			eyes[num].attr({
				'cx': x + w / 4,
				'cy': y + h / 4 * (num + 1)
			});
		}
		for(var num = 3; num < 6; num++)
		{
			eyes[num].attr({
				'cx': x + w - w / 4,
				'cy': y + h / 4 * (num - 2)
			});
		}
		eyes[6].attr({
			'cx': x + w / 2,
			'cy': y + h / 2
		});
		return this;
	};
	
	this.setEyes = function(num)
	{
		this.eyes = num;
		eyes.forEach(function(eye)
		{
			eye.hide();
		});
		switch(num)
		{
			case 1:
				eyes[6].show();
				break;
			case 2:
				eyes[2].show();
				eyes[3].show();
				break;
			case 3:
				eyes[2].show();
				eyes[6].show();
				eyes[3].show();
				break;
			case 4:
				eyes[0].show();
				eyes[2].show();
				eyes[3].show();
				eyes[5].show();
				break;
			case 5:
				eyes[0].show();
				eyes[2].show();
				eyes[3].show();
				eyes[5].show();
				eyes[6].show();
				break;
			case 6:
				eyes[0].show();
				eyes[1].show();
				eyes[2].show();
				eyes[3].show();
				eyes[4].show();
				eyes[5].show();
				break;
		}
		return this;
	};
	
	this.highlight = function(cx, cy)
	{
		glow.stop().animate({ 'stroke-opacity': 1.0 }, 200);
		window.setTimeout(function()
		{
			glow.stop().animate({ 'stroke-opacity': 0 }, 200);
		}, 400);
		return this;
	};
	
	this.show = function()
	{
		this.visible = true;
		this.set.show();
		this.setEyes(this.eyes);
	},
	
	this.hide = function()
	{
		this.visible = false;
		this.set.hide();
		this.setEyes(this.eyes);
	},
	
	this.shown = function()
	{
		if(this.visible) return true;
		else return false;
	},
	
	this.replace(x, y);
	this.set = r.set().push(rect, glow, eyes[0], eyes[1], eyes[2], eyes[3], eyes[4], eyes[5], eyes[6]);
	return this;
};
