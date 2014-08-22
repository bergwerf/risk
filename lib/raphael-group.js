Raphael.fn.group = function(items)
{
	var group = this.raphael.vml ? 
		document.createElement('group') : 
		document.createElementNS('http://www.w3.org/2000/svg', 'g');
	this.canvas.appendChild(group);

	this.push = function(item)
	{
		function pushItems(i)
		{
			if(i.length != undefined)
				for(var num = 0; num < i.length; num++) pushItems(i[num]);
			else group.appendChild(i.node);
		}
		pushItems(item)
		return this;
	};
	
	this.pop = function()
	{
		return group.removeChild(group.lastChild);
	}
	
	this.show = function()
	{
		group.style.display = 'block';
		return this;
	};
	
	this.hide = function()
	{
		group.style.display = 'none';
		return this;
	};
	
	this.type = 'group';
	this.node = group;
	if(items) this.push(items);
	return this;
};
