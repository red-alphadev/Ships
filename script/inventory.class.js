function Inventory(maxWeight){
    this.viewState = false;
    this.items = [];
	this.list = new List();
    this.totalWeight = 0;
    this.maxWeight = maxWeight;

	this.reBuild = function(inv)
	{
		this.viewState = inv.viewState;
		this.totalWeight = inv.totalWeight;
		this.maxWeight = inv.maxWeight;

		for(var i = 0; i < inv.items.length; i++)
		{
			this.items[i] = new Item(1, 1);
			this.items[i].reBuild(inv.items[i]);
		}
	};

	this.getViewStatus = function()
	{
		return this.viewState;
	};

    this.addItem = function(item)
    {
        if (item == null) return false;

        var i, itemFound = false;

        if (this.maxWeight < this.totalWeight + (item.getItemWeight() * item.getItemQuantity()))
        {
            return false;
        }

        for(i = 0; i < this.items.length; i++)
        {
            if (this.items[i].getItemId() == item.getItemId())
            {
                itemFound = true;
                this.items[i].addItem(item.getItemQuantity());
                this.totalWeight += item.getItemQuantity() * item.getItemWeight();
                i = this.items.length;
            }
        }

        if (!itemFound)
        {
            this.items.push(item);

            this.totalWeight += item.getItemQuantity() * item.getItemWeight();
        }

        return true;
    };

    this.removeItem = function(id, qty)
    {
        var i;

        for (i = 0; i < this.items.length; i++)
        {
            if (this.items[i].getItemId() == id && this.items[i].getItemQuantity() >= qty)
            {
                this.totalWeight -= this.items[i].getItemWeight() * qty;
                this.items[i].removeItem(qty);

				if (this.items[i].getItemQuantity() == 0)
				{
					this.list.removeItem(id);
				}
                return true;
            }
        }

        return false;
    };

    this.getInventoryItems = function()
    {
        return this.items;
    };

    this.getMaxWeight = function()
    {
        return this.maxWeight;
    };

    this.getWeight = function()
    {
        return this.totalWeight;
    };

    this.changeViewState = function(){
        this.viewState = !this.viewState;
    };

    this.getItemById = function(itemId)
    {
        for (var i = 0; i < this.items.length; i++)
        {
            if (this.items[i].getItemId() == itemId)
            {
                return this.items[i];
            }
        }

        return false;
    };

    this.getItems = function()
    {
        return this.items;
    };

	this.getList = function()
	{
		return this.list;
	};

    this.draw = function(c)
    {
        if (this.viewState)
        {
            var string, hOffset, vOffset;

			this.list.addList(this.items);
            this.list.setCoordinates(canvasWidth / 1.5 - 50, canvasHeight / 4, canvasWidth / 3, canvasHeight / 2);
            this.list.draw(c);

            c.font = '10px Verdana';
            c.fillStyle = 'white';

            string = 'Total weight: ' + this.totalWeight;
            hOffset = canvasWidth / 1.5 - 50;
            vOffset = 3 * canvasHeight / 4 + 15;
            c.fillText(string, hOffset, vOffset);
        }
        return this.viewState;
    }
}