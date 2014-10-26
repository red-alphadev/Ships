function Building(x, y, id, count)
{
	this.buildingName = Buildings[id].name + ' #' + count;
    this.inventory = new Inventory(grn(750000, 1250000));

	this.createItems = Buildings[id].itemsCreated;
	this.useItems = Buildings[id].itemsRequired;

    this.maxItems = {};
	this.usedItemsList = {};

    this.posX = x;
    this.posY = y;
    this.canvasX = 0;
    this.canvasY = 0;
    this.vertices = Buildings[id].vertices;

    this.init = function()
    {
        var totalItems = this.createItems.length + this.useItems.length;

        for (var i = 0; i < this.useItems.length; i++)
        {
            var ItemObj = new Item(this.useItems[i].id, 0);
            ItemObj.setCanBuy(true);
            this.inventory.addItem(ItemObj);

            this.maxItems[this.useItems[i].id] = this.inventory.getMaxWeight() / totalItems / itemWeights[this.useItems[i].id];
            this.inventory.getItemById(this.useItems[i].id).setItemPrice(this.getBuyPrice(i));
        }

        for (i = 0; i < this.createItems.length; i++)
        {
            ItemObj = new Item(this.createItems[i].id, 0);
            ItemObj.setCanSell(true);
            this.inventory.addItem(ItemObj);

            this.maxItems[this.createItems[i].id] = this.inventory.getMaxWeight() / totalItems / itemWeights[this.createItems[i].id];
            this.inventory.getItemById(this.createItems[i].id).setItemPrice(this.getSellPrice(i));
        }
    };

	this.reBuild = function(bild)
	{
		this.buildingName = bild.buildingName;
		this.vertices = bild.vertices;
		this.posX = bild.posX;
		this.posY = bild.posY;

		this.inventory = new Inventory(1);
		this.inventory.reBuild(bild.inventory);
		this.init();
	};

    this.addItem = function(item)
    {
        this.inventory.addItem(item);
    };

    this.canBuyItem = function(itemId)
    {
        if (!this.maxItems[itemId] || this.inventory.getItemById(itemId).getItemQuantity() >= this.maxItems[itemId])
        {
            return false;
        }

		for (var i = 0; i < this.useItems.length; i++)
		{
			if (this.useItems[i].id == itemId)
			{
				return true;
			}
		}

		return false;
    };

	this.canSellItem = function(itemId)
	 {
		 if (!this.maxItems[itemId] || this.inventory.getItemById(itemId).getItemQuantity() >= this.maxItems[itemId])
		 {
			 return false;
		 }

		 for (var i = 0; i < this.createItems.length; i++)
		 {
			 if (this.createItems[i].id == itemId)
			 {
				 return true;
			 }
		 }

		 return false;
	 };

    this.getBuyPrice = function(i)
    {
        var actualPrice = itemMediumPrices[this.useItems[i].id];
        var p = this.inventory.getItemById(this.useItems[i].id).getItemQuantity() / this.maxItems[this.useItems[i].id];

        return actualPrice * (1.5 - p);
    };

    this.getSellPrice = function(i)
    {
        var actualPrice = itemMediumPrices[this.createItems[i].id];
        var p = this.inventory.getItemById(this.createItems[i].id).getItemQuantity() / this.maxItems[this.createItems[i].id];

        return actualPrice * (1.5 - p);
    };

    this.runProcess = function (time) {
        var i, itemsToUse, canCreate;

		for (i = 0; i < this.useItems.length; i++)
		{
			var itemId = this.useItems[i].id;
			var itemLastUsedTime = this.useItems[i].lastUsedTime;
			var itemTimeToUse = this.useItems[i].time;

			if (!this.usedItemsList.hasOwnProperty(itemId))
			{
				itemsToUse = Math.floor((time - itemLastUsedTime) / itemTimeToUse);
				if (itemsToUse > 0 && this.inventory.getItemById(itemId).getItemQuantity() >= itemsToUse)
				{
					this.usedItemsList[itemId] = true;

					this.inventory.removeItem(itemId, itemsToUse);
					this.inventory.getItemById(itemId).setItemPrice(this.getBuyPrice(i));
				}

				if (time - itemLastUsedTime > itemTimeToUse)
				{
					this.useItems[i].lastUsedTime = time;
				}
			}
		}

		if (Object.keys(this.usedItemsList).length != this.useItems.length)
		{
			canCreate = false;
		}
		else
		{
			canCreate = true;
			for (i = 0; i < Object.keys(this.usedItemsList).length; i++)
			{
				if (this.usedItemsList[this.useItems[i].id] && this.usedItemsList[this.useItems[i].id] == false)
				{
					canCreate = false;
				}
			}
		}

		if (canCreate)
		{
			for (i = 0; i < this.createItems.length; i++)
			{
				var itemId = this.createItems[i].id;
				var itemLastCreatedTime = this.createItems[i].lastCreatedTime;
				var itemTimeToCreate = this.createItems[i].time;

				itemsToUse = Math.floor((time - itemLastCreatedTime) / itemTimeToCreate);
				if (itemsToUse > 0 && this.maxItems[itemId] > this.inventory.getItemById(itemId).getItemQuantity() + itemsToUse)
				{
					var newItems = new Item(itemId, itemsToUse);
					this.inventory.addItem(newItems);
					this.inventory.getItemById(itemId).setItemPrice(this.getSellPrice(i));

					this.createItems[i].lastCreatedTime = time;
					this.usedItemsList = {};
				}
			}
		}
    };

    this.getInventory = function()
    {
        return this.inventory;
    };

    this.draw = function(c, shipX, shipY)
    {
        var i, vLen = this.vertices.length / 2;

        if ((shipX > canvasWidth / 2) && (shipX < mapSize - canvasWidth / 2))
        {
            this.canvasX = this.posX - shipX + canvasWidth / 2;
        }
        else if (shipX < canvasWidth / 2)
        {
            this.canvasX = this.posX;
        }
        else
        {
            this.canvasX = canvasWidth - (mapSize - this.posX);
        }

        if (shipY > canvasHeight / 2 && shipY < mapSize - canvasHeight / 2)
        {
            this.canvasY = this.posY - shipY + canvasHeight / 2;
        }
        else if (shipY < canvasHeight / 2)
        {
            this.canvasY = this.posY;
        }
        else
        {
            this.canvasY = canvasHeight - (mapSize - this.posY);
        }

        c.strokeStyle = 'magenta';
        c.lineWidth = 1;

        c.beginPath();

		c.shadowOffsetX = 3;
		c.shadowOffsetY = 3;
		c.shadowBlur    = 5;
		c.shadowColor   = "#FFFFFF";

        c.moveTo(this.vertices[0] + this.canvasX, this.vertices[1] + this.canvasY);
        for(i = 1; i < vLen; i++)
        {
            c.lineTo(this.vertices[2*i] + this.canvasX, this.vertices[2*i+1] + this.canvasY);
        }
        c.closePath();
        c.stroke();

		c.shadowOffsetX = 0;
		c.shadowOffsetY = 0;
		c.shadowBlur    = 0;
		c.shadowColor   = "";

        c.font = '11px Verdana';
        c.fillStyle = 'white';
        c.fillText(this.buildingName, this.canvasX, this.canvasY - 5);
//		c.fillText(this.inventory.getItemById(3).getItemQuantity(), this.canvasX, this.canvasY - 25);
//		c.fillText(this.inventory.getItemById(4).getItemQuantity(), this.canvasX, this.canvasY - 35);
//		c.fillText(this.inventory.getItemById(10).getItemQuantity(), this.canvasX, this.canvasY - 15);
//		c.fillText(JSON.stringify(this.usedItemsList), this.canvasX, this.canvasY - 45);
    };

    this.isCloseTo = function(c, x, y)
    {
        return  Math.pow(x - this.posX, 2) + Math.pow(y - this.posY, 2) < Math.pow(canvasWidth, 2);
    };

	this.isCloseToBuilding = function(object)
	{
		return Math.pow(object.posX - this.posY, 2) + Math.pow(object.posY - this.posY, 2) < Math.pow(500, 2);
	};

	this.isCloseToAsteroid = function(object)
	{
		return Math.pow(object.AreaPosX - this.posY, 2) + Math.pow(object.AreaPosY - this.posY, 2) < Math.pow(500, 2);
	};

    this.isClicked = function(x, y)
    {
        var nvert = this.vertices.length / 2;
        var i, j, c = false, vertX = [], vertY = [];

        for(i = 0; i < nvert; i++)
        {
            vertX[i] = this.vertices[2*i] + this.canvasX;
            vertY[i] = this.vertices[2*i + 1] + this.canvasY;
        }

        for (i = 0, j = nvert - 1; i < nvert; j = i++)
        {
            if ( ((vertY[i] > y) != (vertY[j] > y)) &&
                 (x < (vertX[j] - vertX[i]) * (y - vertY[i]) / (vertY[j] - vertY[i]) + vertX[i])
                )
                c = !c;
        }

        return c;
    };

	this.init();
}