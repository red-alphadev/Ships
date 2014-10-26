function Context()
{
	this.viewStatus = false;
	this.context = 0;		//1 - from trading window; 2 - from inventory
	this.direction = 0;		//1 - from player to NPC; 2 - from NPC to player
    this.item = [];
	this.objectType = 0;	//1 - resource, 2 - weapon, 3 - mining laser, 4 - shields; 5 - credits
	this.quantity = 0;

    this.canvasXOffset = 0;
    this.canvasYOffset = 0;
    this.maxWidth = 0;
    this.maxHeight = 0;

    this.lineHeight = 17;
    this.margin = 4;

	this.openContextConsole = function(item, context, direction)
	{
		this.item = item;
		var itemId = this.item.getItemId();

		if (itemId < 100)
		{
			this.objectType = 1;
		}
		else if (itemId < 200)
		{
			this.objectType = 2;
		}
		else if (itemId < 300)
		{
			this.objectType = 3;
		}
		else if (itemId < 400)
		{
			this.objectType = 4;
		}
		else if (itemId == 9999)
		{
			this.objectType = 5;
		}

		this.context = context;
		this.direction = direction;
		this.viewStatus = true;

		if (this.context == 1)
		{
			if (this.item.canSell)
			{
				this.setCoordinates(mouseX, mouseY, 50, 50);
			}
			else
			{
				this.setCoordinates(mouseX, mouseY, 150, 25);
			}
		}
		else if (this.context == 2)
		{
			this.setCoordinates(mouseX - 50, mouseY, 100, 25);
		}

		if (itemId == 9999)
		{
			this.setCoordinates(mouseX - 50, mouseY, 150, 25);
		}
	};

    this.setCoordinates = function(xOffset, yOffset, maxWidth, maxHeight)
    {
        this.canvasXOffset = xOffset;
        this.canvasYOffset = yOffset;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    };

	this.setQuantity = function(q)
	{
		if (q <= this.item.getItemQuantity())
		{
			this.quantity = q;
		}
		else
		{
			this.quantity = this.item.getItemQuantity();
		}
	};

	this.getQuantity = function()
	{
		return this.quantity;
	};

	this.enableView = function()
	{
		this.viewStatus = true;
	};

	this.disableView = function()
	{
		this.viewStatus = false;
	};

	this.getViewStatus = function()
	{
		return this.viewStatus;
	};

	this.getItem = function()
	{
		return this.item;
	};

    this.setMaxHeight = function(mHeight)
    {
        this.maxHeight = mHeight;
    };

    this.isSelected = function(itemPos)
    {
        if (mouseY >= this.canvasYOffset && mouseX >= this.canvasXOffset && mouseX < this.maxWidth + this.canvasXOffset)
        {
            var position = Math.ceil((mouseY - this.canvasYOffset) / (this.lineHeight + 2 * this.margin));

            return position == itemPos;
        }

        return false;
    };

    this.getSelected = function()
    {
        if ( mouseX >= this.canvasXOffset && mouseX <= this.maxWidth + this.canvasXOffset &&
            mouseY >= this.canvasYOffset && mouseY <= this.canvasYOffset + this.maxHeight)
        {
            var position = Math.ceil((mouseY - this.canvasYOffset) / (this.lineHeight + 2*this.margin));

			return position;
        }

        return false;
    };

    this.draw = function(c)
    {
		if (!this.viewStatus) return false;

        c.fillStyle = '#111111';
        c.fillRect(this.canvasXOffset, this.canvasYOffset, this.maxWidth, this.maxHeight);

        c.font = '10px Verdana';
        c.fillStyle = 'white';
        c.lineWidth = 1;
        c.rect(this.canvasXOffset, this.canvasYOffset, this.maxWidth, this.maxHeight);
        c.stroke();

        var offsetY = this.canvasYOffset, lineHeight = this.lineHeight + 2 * this.margin;

		//Selling from player to NPC
		if (this.context == 1 && this.direction == 1)
		{
			if (this.item.canSell)
			{
				var selectedItemPosition = this.getSelected();

				if (selectedItemPosition != false)
				{
					c.fillStyle = 'gray';
					var canvasY = this.canvasYOffset + lineHeight * (selectedItemPosition - 1);

					c.fillRect(this.canvasXOffset, canvasY, this.maxWidth, lineHeight);
				}

				c.fillStyle = 'white';
				c.fillText('Sell All', this.canvasXOffset + this.margin, offsetY + this.lineHeight);
				offsetY += this.lineHeight + 2 * this.margin;
				c.fillText('Sell: ' + this.quantity, this.canvasXOffset + this.margin, offsetY + this.lineHeight);
			}
			else
			{
				c.fillStyle = 'white';
				c.fillText('Cannot trade item', this.canvasXOffset + this.margin, offsetY + this.lineHeight);
			}
		}

		//Buying from NPC
		if (this.context == 1 && this.direction == 2)
		{
			if (this.item.canSell)
			{
				var selectedItemPosition = this.getSelected();

				if (selectedItemPosition != false)
				{
					c.fillStyle = 'gray';
					var canvasY = this.canvasYOffset + lineHeight * (selectedItemPosition - 1);

					c.fillRect(this.canvasXOffset, canvasY, this.maxWidth, lineHeight);
				}

				c.fillStyle = 'white';
				c.fillText('Buy All', this.canvasXOffset + this.margin, offsetY + this.lineHeight);
				offsetY += this.lineHeight + 2 * this.margin;
				c.fillText('Buy: ' + this.quantity, this.canvasXOffset + this.margin, offsetY + this.lineHeight);
			}
			else
			{
				c.fillStyle = 'white';
				c.fillText('Cannot buy item', this.canvasXOffset + this.margin, offsetY + this.lineHeight);
			}
		}

		//Inventory
		if (this.context == 2)
		{
			if (this.objectType > 1 && this.objectType < 5)
			{
				var selectedItemPosition = this.getSelected();

				if (selectedItemPosition != false)
				{
					c.fillStyle = 'gray';
					var canvasY = this.canvasYOffset + lineHeight * (selectedItemPosition - 1);

					c.fillRect(this.canvasXOffset, canvasY, this.maxWidth, lineHeight);
				}

				c.fillStyle = 'white';
				c.fillText('Equip Item', this.canvasXOffset + this.margin, offsetY + this.lineHeight);
			}
		}

		if (this.item.getItemId() == 9999)
		{
			c.fillStyle = 'white';
			c.fillText('Use credits to buy stuff', this.canvasXOffset + this.margin, offsetY + this.lineHeight);
		}
    };
}