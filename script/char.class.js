function Char()
{
    this.viewstate = false;
    this.laserOne = new Item(101, 1);
    this.laserTwo = new Item(101, 1);
    this.miningLaser = new Item(209, 1);
    this.shield = new Item(301, 1);

    this.windowWidth = canvasWidth / 6;
    this.windowHeight = canvasHeight / 1.5;
    this.windowX = canvasWidth / 6;
    this.windowY = canvasHeight / 6;

	this.reBuild = function(char)
	{
		this.viewstate = char.viewstate;
		this.laserOne = new Item(101, 1);
		this.laserOne.reBuild(char.laserOne);

		this.laserTwo = new Item(101, 1);
		this.laserTwo.reBuild(char.laserTwo);

		this.miningLaser = new Item(201, 1);
		this.miningLaser.reBuild(char.miningLaser);

		this.shield = new Item(301, 1);
		this.shield.reBuild(char.shield);
	};

	this.getMiningLaser = function()
	{
		return this.miningLaser;
	};

	this.getShield = function()
	{
		return this.shield;
	};

	this.getLaserOne = function()
	{
		return this.laserOne;
	};

	this.getLaserTwo = function()
	{
		return this.laserTwo;
	};

	this.equipItem = function(itemId)
	{
		var last = {}, newItem = new Item(itemId, 1);
		if (newItem.isLaser)
		{
			last = this.laserOne;
			this.laserOne = newItem;
			return last;
		}

		if (newItem.isMiningLaser)
		{
			last = this.miningLaser;
			this.miningLaser = newItem;
			return last;
		}

		if (newItem.isShield)
		{
			last = this.shield;
			this.shield = newItem;
			return last;
		}

		return false;
	};

    this.draw = function(c)
    {
		if (this.viewstate)
		{
			var marginX = Math.floor(this.windowWidth / 10);
			var marginY = Math.floor(this.windowHeight / 10);

			c.fillStyle = '#010101';
			c.beginPath();
			c.fillRect(this.windowX, this.windowY, this.windowWidth, this.windowHeight);
			c.lineWidth = 1;
			c.closePath();

			c.strokeStyle = 'darkgray';
			c.beginPath();
			c.rect(this.windowX, this.windowY, this.windowWidth, this.windowHeight);
			c.closePath();
			c.stroke();

			c.strokeStyle = 'white';
			c.beginPath();
			c.moveTo(this.windowX + marginX, this.windowY + this.windowHeight - marginY);
			c.lineTo(Math.floor(this.windowX + (this.windowWidth) / 2), this.windowY + marginY);
			c.lineTo(Math.floor(this.windowX + this.windowWidth - marginX), this.windowY + this.windowHeight - marginY);
			c.closePath();
			c.stroke();

			c.font = '12px Verdana';
			c.fillStyle = 'red';
			if (!isEmptyObject(this.laserOne))
			{
				c.fillText(this.laserOne.getItemName(), this.windowX + marginX, this.windowY + this.windowHeight / 2);
			}
			else
			{
				c.fillText('No weapon installed', this.windowX + marginX, this.windowY + this.windowHeight / 2);
			}

			if (!isEmptyObject(this.laserTwo))
			{
				c.fillText(this.laserTwo.getItemName(), this.windowX + this.windowWidth - marginX - (6 * this.laserTwo.getItemName().length), this.windowY + this.windowHeight / 2);
			}
			else
			{
				c.fillText('No weapon installed', this.windowX + this.windowWidth - marginX - 114, this.windowY + this.windowHeight / 2);
			}

			c.fillStyle = 'yellow';
			if (!isEmptyObject(this.miningLaser))
			{
				c.fillText(this.miningLaser.getItemName(),
					Math.floor(this.windowX + (this.windowWidth - marginX) / 2) - (2.8 * this.miningLaser.getItemName().length),
					this.windowY + 2 * marginY);
			}
			else
			{
				c.fillText('No mining laser installed',
					Math.floor(this.windowX + (this.windowWidth -marginX) / 2) - (2.8 * 25),
					this.windowY + marginY);
			}

			c.fillStyle = 'blue';
			if (!isEmptyObject(this.shield))
			{
				c.fillText(this.shield.getItemName(),
					Math.floor(this.windowX + (this.windowWidth -marginX) / 2) - (2.8 * this.shield.getItemName().length),
					this.windowY + this.windowHeight - 2 * marginY);
			}
			else
			{
				c.fillText('No shield installed',
					Math.floor(this.windowX + (this.windowWidth -marginX) / 2) - (2.8 * 19),
					this.windowY + this.windowHeight - 2 * marginY);
			}
		}
    };

    this.changeViewState = function()
    {
        this.viewstate = !this.viewstate;
    };
}