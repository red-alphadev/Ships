function Panel(obj1, obj2)
{
    this.viewState = false;
    this.leftItems = new List();
    this.rightItems = new List();
    this.objectLeft = obj1;
    this.objectRight = obj2;
	this.objectPosSelected = 0;

    this.init = function()
    {
        this.leftItems.addList(this.objectLeft.getInventory().getInventoryItems());
        this.rightItems.addList(this.objectRight.getInventory().getInventoryItems());
        this.leftItems.setCoordinates(50, 50, canvasWidth / 2 - 50, canvasHeight - 100);
        this.rightItems.setCoordinates(canvasWidth / 2, 50, canvasWidth / 2 - 50, canvasHeight - 100);
    };

    this.changeState = function()
    {
        this.viewState = !this.viewState;
    };

    this.getViewStatus = function()
    {
        return this.viewState;
    };

	this.getOperationFromWho = function()
	{
		return this.objectPosSelected;
	};

    this.getClickedItem = function()
    {
        var objectClickedLeft, objectClickedRight;

        objectClickedLeft = this.leftItems.getSelected();
        objectClickedRight = this.rightItems.getSelected();

		if (objectClickedLeft)
		{
			this.objectPosSelected = 1;
			return objectClickedLeft;
		}

		if (objectClickedRight)
		{
			this.objectPosSelected = 2;
			return objectClickedRight;
		}

		return false;
	};

	this.processOrder = function(obj, quantity)
	{
		if (this.objectPosSelected == 1)
		{
			if (this.objectRight.canBuyItem(obj.getItemId()))
			{
				var price = this.objectRight.getInventory().getItemById(obj.getItemId()).getItemPrice();
				this.objectLeft.getInventory().removeItem(obj.getItemId(), quantity);
				if (obj.getItemQuantity() == 0)
				{
					this.leftItems.removeItem(obj.getItemId());
				}

				var newItemObj = new Item(9999, price * quantity);
				newItemObj.setCanSell(false);
				newItemObj.setCanBuy(false);

				this.objectLeft.getInventory().addItem(newItemObj);
				if (!this.leftItems.hasItem(newItemObj))
				{
					this.leftItems.addItem(newItemObj);
				}

				newItemObj = new Item(obj.getItemId(), quantity);
				this.objectRight.addItem(newItemObj);
				if (!this.rightItems.hasItem(newItemObj))
				{
					this.rightItems.addItem(newItemObj);
				}
			}
			else
			{
				return 'Cannot sell item';
			}
		}

		if (this.objectPosSelected == 2)
		{
			if (this.objectRight.canSellItem(obj.getItemId()))
			{
				var shipCredits = this.objectLeft.getInventory().getItemById(9999);
				if (shipCredits != false)
				{
					shipCredits = shipCredits.getItemQuantity();
					var itemPrice = obj.getItemPrice();

					if (itemPrice <= shipCredits && obj.getItemQuantity() > 0)
					{
						this.objectRight.getInventory().removeItem(obj.getItemId(), quantity);

						newItemObj = new Item(obj.getItemId(), quantity);
						newItemObj.setCanSell(true);
						this.objectLeft.getInventory().addItem(newItemObj);

						this.objectLeft.getInventory().removeItem(9999, itemPrice);

						if (!this.leftItems.hasItem(newItemObj))
						{
							this.leftItems.addItem(newItemObj);
						}
					}
				}
			}
			else
			{
				return 'Cannot buy item';
			}
		}

		return false;
	};

    this.draw = function(c)
    {
        if (!this.viewState) return false;

        this.leftItems.draw(c);
        this.rightItems.draw(c);

        c.rect(50, canvasHeight - 50, canvasWidth - 100, 30);
        c.stroke();

		c.fillText('Press \'T\' to Close This Panel', canvasWidth / 2 - 85, 40);
        c.fillText('Total Weight: ' + this.objectLeft.getInventory().getWeight() + ' / ' + this.objectLeft.getInventory().getMaxWeight(), 50, canvasHeight - 30);
        c.fillText('Total Weight: ' + this.objectRight.getInventory().getWeight() + ' / ' + this.objectRight.getInventory().getMaxWeight(), canvasWidth / 2, canvasHeight - 30);
    }
}