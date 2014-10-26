function Ship(posX, posY)
{
    this.angle = 0;
    this.AreaPosX = posX;
    this.AreaPosY = posY;
    this.CanvasPosX = canvasWidth / 2;
    this.CanvasPosY = canvasHeight / 2;
    this.shipVertices = [[0, -15], [-10, 10], [10, 10]];
    this.speed = 0.6;
    this.speedX = 0;
    this.speedY = 0;
    this.friction = friction;
    this.health = 100;
    this.shotModulation = 5;
	this.equipment = new Char();
    this.shield = new Shield(this.CanvasPosX, this.CanvasPosY, this.equipment.getShield().getShieldStrength(), 5, 1);
    this.inventory = new Inventory(1000); this.inventory.addItem(new Item(202, 1));
	this.fireMode = 1;
	this.lastShotTimeOne = 0;
	this.lastShotTimeTwo = 0;

	this.reBuild = function(s)
	{
		this.angle = s.angle;
		this.AreaPosX = s.AreaPosX;
		this.AreaPosY = s.AreaPosY;
		this.CanvasPosX = s.CanvasPosX;
		this.CanvasPosY = s.CanvasPosY;
		this.speed = s.speed;
		this.health = s.health;
		this.shotModulation = s.shotModulation;
		this.fireMode = s.fireMode;

		this.equipment = new Char();
		this.equipment.reBuild(s.equipment);

		this.shield = new Shield(this.CanvasPosX, this.CanvasPosY, this.equipment.getShield().getShieldStrength(), 5, 1);
		this.inventory = new Inventory(1000);
		this.inventory.reBuild(s.inventory);
	};

	this.equipItem = function(item)
	{
		var lastItem = this.equipment.equipItem(item.getItemId());

		if (lastItem != false)
		{
			this.inventory.removeItem(item.getItemId(), 1);
			this.inventory.addItem(lastItem);

			if (item.isShield)
			{
				this.shield.setShieldStrength(item.getShieldStrength());
			}
			return true;
		}

		return false;
	};

    this.incrementFrames = function()
    {
        if (this.frames == 30)
        {
            this.frames = 0;
            return true;
        }
        else
        {
            this.frames++;
        }

        return false;
    };

	this.changeFireMode = function()
	{
		if (this.fireMode == 1)
		{
			this.fireMode = 2;
		}
		else
		{
			this.fireMode = 1;
		}
	};

    this.getInventory = function()
    {
        return this.inventory;
    };

	this.getCharacterScreen = function()
	{
	 return this.equipment;
	};

    this.getItems = function()
    {
        return this.inventory.getItems();
    };

    this.draw = function(c)
    {
        this.angle = Math.atan2((this.CanvasPosX - mouseX), (this.CanvasPosY - mouseY));

        c.strokeStyle = 'red';
        c.beginPath();
		c.lineJoin = 'round';
        for (var i = 0; i < this.shipVertices.length; i++)
        {
            var x = this.shipVertices[i][0] * Math.cos(this.angle) + this.shipVertices[i][1] * Math.sin(this.angle);
            var y = this.shipVertices[i][1] * Math.cos(this.angle) - this.shipVertices[i][0] * Math.sin(this.angle);

            if (i == 0)
            {
                c.moveTo(x + this.CanvasPosX, y + this.CanvasPosY);
            }
            else
            {
                c.lineTo(x + this.CanvasPosX, y + this.CanvasPosY);
            }
        }
		c.closePath();
        c.stroke();
		c.fillStyle = 'red';
		c.fill();

		this.shield.draw(c, this.CanvasPosX, this.CanvasPosY);
        this.inventory.draw(c);
		this.equipment.draw(c);

        c.font = '12px Verdana';
        c.fillStyle = 'blue';
        c.fillText(this.shield.getShield(), this.CanvasPosX - 60, this.CanvasPosY);
        c.fillStyle = 'red';
        c.fillText(this.health.toString(), this.CanvasPosX + 30, this.CanvasPosY);
        c.fillStyle = 'white';
		if (this.fireMode == 1)
		{
			c.fillText('Weapons active', this.CanvasPosX - 50, this.CanvasPosY - 35);
		}
		else
		{
			c.fillText('Mining mode active', this.CanvasPosX - 60, this.CanvasPosY - 35);
		}

        c.fillText('APosX: ' + Math.round(this.AreaPosX * 100) / 100, 10, 20);
        c.fillText('APosY: ' + Math.round(this.AreaPosY * 100) / 100, 10, 40);
//        c.fillText('CPosX: ' + this.CanvasPosX, 10, 60);
//        c.fillText('CPosY: ' + this.CanvasPosY, 10, 80);
//        c.fillText('MouseX: ' + mouseX, 10, 100);
//        c.fillText('MouseY: ' + mouseY, 10, 120);
//        c.fillText('Angle: ' + Math.round(this.angle * 100) / 100, 10, 140);
    };

    this.move = function(c, AreaSizeX, AreaSizeY, keyPressed)
    {
        var middleOfScreenX = canvasWidth / 2;
        var middleOfScreenY = canvasHeight / 2;

        if (keyPressed[83])
        {
            this.speedY += this.speed;
        }
        if (keyPressed[87])
        {
            this.speedY -= this.speed;
        }

        if (keyPressed[68])
        {
            this.speedX += this.speed;
        }

        if (keyPressed[65])
        {
            this.speedX -= this.speed;
        }

        if (this.AreaPosX < 20)
        {
            this.AreaPosX = 20;
        }else if (this.AreaPosX > AreaSizeX - 20)
        {
            this.AreaPosX = AreaSizeX - 20;
        }
        else
        {
            this.CanvasPosX = middleOfScreenX;
        }

        if (this.AreaPosY < 20)
        {
            this.AreaPosY = 20;
        }else if (this.AreaPosY > AreaSizeY - 40)
        {
            this.AreaPosY = AreaSizeY - 40;
        }
        else
        {
            this.CanvasPosY = middleOfScreenY;
        }

        this.speedX *= this.friction;
        this.speedY *= this.friction;

        this.AreaPosX += this.speedX;
        this.AreaPosY += this.speedY;

        if (this.AreaPosX < middleOfScreenX)
        {
            this.CanvasPosX = this.AreaPosX;
        }
        else if (this.AreaPosX > AreaSizeX - middleOfScreenX)
        {
            this.CanvasPosX = this.AreaPosX - AreaSizeX + canvasWidth;
        }

        if (this.AreaPosY < middleOfScreenY)
        {
            this.CanvasPosY = this.AreaPosY;
        }
        else if (this.AreaPosY > AreaSizeY - middleOfScreenY)
        {
            this.CanvasPosY = this.AreaPosY - AreaSizeY + canvasHeight;
        }

        this.draw(c);
    };

    this.getX = function()
    {
        return this.AreaPosX;
    };

    this.getY = function()
    {
        return this.AreaPosY;
    };

    this.getCanvasX = function()
    {
        return this.CanvasPosX;
    };

    this.getCanvasY = function()
    {
        return this.CanvasPosY;
    };

    this.changeHealth = function(byAmount, shotModulation)
    {
        if (this.shield.getModulation() == shotModulation)
        {
            return false;
        }
        else if (Math.abs(this.shield.getModulation() - shotModulation) > 2 && Math.abs(this.shield.getModulation() - shotModulation) < 6)
        {
            byAmount *= 2;
        }

        if (this.shield.getShield() + byAmount > 0)
        {
            this.shield.setStrength(byAmount);
        }
        else
        {
            byAmount -= this.shield.getShield();
            this.shield.setStrength(-this.shield.getShield());
            this.health += byAmount;
        }

        return true;
    };

    this.getHealth = function()
    {
        return this.health;
    };

    this.increaseModulation = function()
    {
        this.shield.increaseModulation();
    };

    this.decreaseModulation = function()
    {
        this.shield.decreaseModulation();
    };

    this.getModulation = function()
    {
        return this.shield.getModulation();
    };

    this.increaseShotModulation = function()
    {
        if (this.shotModulation < 9)
        {
            this.shotModulation++;
        }
    };

    this.decreaseShotModulation = function()
    {
        if (this.shotModulation > 0)
        {
            this.shotModulation--;
        }
    };

    this.getShotModulation = function()
    {
        return this.shotModulation;
    };

	this.getFireMode = function()
	{
		return this.fireMode;
	};

	this.fire = function(time)
	{
		var shots = [], x, y, shotPower;

		if (!this.equipment.getLaserOne() && !this.equipment.getLaserTwo()) return false;

		if (!isEmptyObject(this.equipment.laserOne))
		{
			if (time - this.lastShotTimeOne >= this.equipment.getLaserOne().fireRate)
			{
				x = -5 * Math.cos(this.angle) + this.CanvasPosX;
				y =  5 * Math.sin(this.angle) + this.CanvasPosY;

				shotPower = grn(this.equipment.getLaserOne().getMinLaserDamange(), this.equipment.getLaserOne().getMaxLaserDamange());
				shots.push(new Shot(x + this.AreaPosX, y + this.AreaPosY, x, y, mouseX, mouseY, shotPower, 20, 5, 'red'));

				this.lastShotTimeOne = time;
			}
		}

		if (!isEmptyObject(this.equipment.laserTwo))
		{
			if (time - this.lastShotTimeTwo >= this.equipment.getLaserTwo().fireRate)
			{
				x =  5 * Math.cos(this.angle) + this.CanvasPosX;
				y = -5 * Math.sin(this.angle) + this.CanvasPosY;

				shotPower = grn(this.equipment.getLaserOne().getMinLaserDamange(), this.equipment.getLaserOne().getMaxLaserDamange());
				shots.push(new Shot(x + this.AreaPosX, y + this.AreaPosY, x, y, mouseX, mouseY, shotPower, 20, 5, 'red'));

				this.lastShotTimeTwo = time;
			}
		}

		return shots;
	}
}