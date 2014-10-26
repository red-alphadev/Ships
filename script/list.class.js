function List()
{
    this.items = [];

    this.canvasXOffset = 0;
    this.canvasYOffset = 0;
    this.maxWidth = 0;
    this.maxHeight = 0;

    this.lineHeight = 15;
    this.margin = 4;

    this.itemsCount = 0;
    this.startFrom = 0;

    this.setCoordinates = function(xOffset, yOffset, maxWidth, maxHeight)
    {
        this.canvasXOffset = xOffset;
        this.canvasYOffset = yOffset;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    };

    this.addList = function(itemList)
    {
        this.items = itemList;
        this.itemsCount = itemList.length;
    };

    this.addItem = function(item)
    {
        var found = false;
        for (var i = 0; i < this.itemsCount; i++)
        {
            if (item.getItemId() == this.items[i].getItemId())
            {
                found = true;
                this.items[i].addItem(item.getItemQuantity());
            }
        }

        if (!found)
        {
            this.items[this.itemsCount] = item;
            this.itemsCount++;
        }
    };

    this.hasItem = function(item)
    {
        for (var i = 0; i < this.itemsCount; i++)
        {
            if (this.items[i].getItemId() == item.getItemId())
            {
                return true;
            }
        }

        return false;
    };

    this.removeItem = function(itemId)
    {
        for (var i = 0; i < this.itemsCount; i++)
        {
            if (this.items[i] && this.items[i].getItemId() == itemId)
            {
                this.items.splice(i, 1);
                this.itemsCount--;
            }
        }
    };

    this.isHigherSelected = function()
    {
        if (mouseX > this.canvasXOffset + this.maxWidth - 25 && mouseX < this.canvasXOffset + this.maxWidth &&
            mouseY > this.canvasYOffset && mouseY < this.canvasYOffset + 25)
        {
            if (this.startFrom > 0)
            {
                this.startFrom--;
            }
        }
    };

    this.isLowerSelected = function()
    {
        if (mouseX > this.canvasXOffset + this.maxWidth - 25 && mouseX < this.canvasXOffset + this.maxWidth &&
            mouseY > this.canvasYOffset + this.maxHeight - 25 && mouseY < this.canvasYOffset + this.maxHeight)
        {
            if (this.startFrom < this.itemsCount - 1)
            {
                this.startFrom++;
            }
        }
    };

    this.isSelected = function(itemPos)
    {
        if (mouseY >= this.canvasYOffset && mouseX >= this.canvasXOffset && mouseX < this.maxWidth + this.canvasXOffset - 25)
        {
            var position = Math.floor((mouseY - this.canvasYOffset) / (this.lineHeight + 2 * this.margin));

            return position + this.startFrom == itemPos;
        }

        return false;
    };

    this.getSelected = function()
    {
        if ( mouseX >= this.canvasXOffset && mouseX <= this.maxWidth + this.canvasXOffset - 25 &&
            mouseY >= this.canvasYOffset && mouseY <= this.canvasYOffset + this.maxHeight)
        {
            var position = Math.floor((mouseY - this.canvasYOffset) / (this.lineHeight + 2*this.margin));

            if (position + this.startFrom < this.itemsCount)
            {
                return this.items[position + this.startFrom];
            }
        }

        this.isLowerSelected();
        this.isHigherSelected();

        return false;
    };

    this.draw = function(c)
    {
        c.fillStyle = '#222222';
        c.fillRect(this.canvasXOffset, this.canvasYOffset, this.maxWidth, this.maxHeight);

        c.font = '10px Verdana';
		c.beginPath();
        c.fillStyle = 'white';
        c.strokeStyle = 'white';
        c.lineWidth = 1;
        c.rect(this.canvasXOffset, this.canvasYOffset, this.maxWidth, this.maxHeight);
		c.closePath();
        c.stroke();

        var offsetY = this.canvasYOffset;
        for(var i = this.startFrom; offsetY < this.maxHeight + this.canvasYOffset - this.lineHeight - 2*this.margin && i < this.itemsCount; i++)
        {
			if (this.items[i] != undefined)
			{
				if (this.isSelected(i))
				{
					c.fillStyle = 'gray';
					c.fillRect(this.canvasXOffset, offsetY, this.maxWidth - 25, this.lineHeight + 2 * this.margin);

					c.fillStyle = 'white';
					c.fillText('(' + Math.round(this.items[i].getItemQuantity() * 10) / 10 + ')', this.canvasXOffset + this.margin, offsetY + this.lineHeight);
					c.fillText(this.items[i].getItemName(), this.canvasXOffset + this.margin + 50, offsetY + this.lineHeight);
					c.fillText('Price: ' + Math.round(this.items[i].getItemPrice() * 100) / 100, this.canvasXOffset + this.margin + this.maxWidth - 120, offsetY + this.lineHeight);
				}
				else
				{
					c.fillStyle = 'whitegray';
					c.fillText('(' + Math.round(this.items[i].getItemQuantity() * 10) / 10 + ')', this.canvasXOffset + this.margin, offsetY + this.lineHeight);
					c.fillText(this.items[i].getItemName(), this.canvasXOffset + this.margin + 50, offsetY + this.lineHeight);
					c.fillText('Price: ' + Math.round(this.items[i].getItemPrice() * 100) / 100, this.canvasXOffset + this.margin + this.maxWidth - 120, offsetY + this.lineHeight);
				}

				offsetY += this.lineHeight + 2 * this.margin;

				c.lineWidth = 1;
				c.moveTo(this.canvasXOffset, offsetY);
				c.lineTo(this.canvasXOffset + this.maxWidth - 25, offsetY);
				c.stroke();
			}
        }

        c.fillStyle = 'white';
		c.moveTo(this.canvasXOffset + this.maxWidth - 25, this.canvasYOffset);
		c.lineTo(this.canvasXOffset + this.maxWidth - 25, this.canvasYOffset + this.maxHeight);
		c.stroke();

        c.beginPath();
        c.moveTo(this.canvasXOffset + this.maxWidth - 25, this.canvasYOffset);
        c.lineTo(this.canvasXOffset + this.maxWidth, this.canvasYOffset);
        c.lineTo(this.canvasXOffset + this.maxWidth, this.canvasYOffset + 25);
        c.lineTo(this.canvasXOffset + this.maxWidth - 25, this.canvasYOffset + 25);
        c.closePath();
        c.stroke();

        c.beginPath();
        c.moveTo(this.canvasXOffset + this.maxWidth - 25, this.canvasYOffset + 25);
        c.lineTo(this.canvasXOffset + this.maxWidth - 12, this.canvasYOffset);
        c.lineTo(this.canvasXOffset + this.maxWidth, this.canvasYOffset + 25);
        c.closePath();
        c.stroke();

        c.beginPath();
        c.moveTo(this.canvasXOffset + this.maxWidth - 25, this.canvasYOffset + this.maxHeight - 25);
        c.lineTo(this.canvasXOffset + this.maxWidth, this.canvasYOffset + this.maxHeight - 25);
        c.lineTo(this.canvasXOffset + this.maxWidth, this.canvasYOffset + this.maxHeight);
        c.lineTo(this.canvasXOffset + this.maxWidth - 25, this.canvasYOffset + this.maxHeight);
        c.closePath();
        c.stroke();

        c.beginPath();
        c.moveTo(this.canvasXOffset + this.maxWidth - 25, this.canvasYOffset + this.maxHeight - 25);
        c.lineTo(this.canvasXOffset + this.maxWidth - 12, this.canvasYOffset + this.maxHeight);
        c.lineTo(this.canvasXOffset + this.maxWidth, this.canvasYOffset + this.maxHeight - 25);
        c.closePath();
        c.stroke();
    }
}