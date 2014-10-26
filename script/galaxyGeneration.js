function galaxy(){
	this.sectors = {};
	this.galaxySize = GALAXYSIZE;

	this.countNeighbours = function(node)
	{
		var count = 0;

		if (node != undefined)
		{
			if (node.north != undefined)
			{
				count++;
			}

			if (node.south != undefined)
			{
				count++;
			}

			if (node.west != undefined)
			{
				count++;
			}

			if (node.east != undefined)
			{
				count++;
			}
		}

		return count;
	};

	this.setSectorLink = function(sectorFrom, sectorTo, cardPoint)
	{
		if (this.sectors[sectorFrom] == undefined)
		{
			this.sectors[sectorFrom] = {};
		}
		if (this.sectors[sectorTo] == undefined)
		{
			this.sectors[sectorTo] = {};
		}

		switch(cardPoint)
		{
			case 1:
				this.sectors[sectorFrom].north = sectorTo;
				this.sectors[sectorTo].south = sectorFrom;
				break;
			case 2:
				this.sectors[sectorFrom].east = sectorTo;
				this.sectors[sectorTo].west = sectorFrom;
				break;
			case 3:
				this.sectors[sectorFrom].south = sectorTo;
				this.sectors[sectorTo].north = sectorFrom;
				break;
			case 4:
				this.sectors[sectorFrom].west = sectorTo;
				this.sectors[sectorTo].east = sectorFrom;
				break;
		}
	};

	this.hasNeighbourSector = function(node, cardinalPoint)
	{
		if (node == undefined)
		{
			return false;
		}

		switch (cardinalPoint)
		{
			case 1:
				if (node.north == undefined)
					return false;
				break;
			case 2:
				if (node.east == undefined)
					return false;
				break;
			case 3:
				if (node.south == undefined)
					return false;
				break;
			case 4:
				if (node.west == undefined)
					return false;
				break;
		}

		return true;
	};

	this.alreadyHasSector = function(node, newSector)
	{
		if (node == undefined)
		{
			return false;
		}

		if (node.north != undefined && node.north == newSector)
		{
			return true;
		}

		if (node.east != undefined && node.east == newSector)
		{
			return true;
		}

		if (node.south != undefined && node.south == newSector)
		{
			return true;
		}

		if (node.west != undefined && node.west == newSector)
		{
			return true;
		}

		return false;
	};

	this.sectorWasUsed = function(level, sectorId)
	{
		for (var i = 0; i < level; i++)
		{
			if (this.alreadyHasSector(this.sectors[i], sectorId))
			{
				return false;
			}
		}

		return true;
	};

	this.generateGalaxyLinks = function()
	{
		var galaxySize = 16;
		var root1, root2;
		var maxNeighbours, newNeighbour, pointTo, i, noMoreChances, counter;

//		root1 = grn(1, galaxySize);
//		do
//		{
//			root2 = grn(1, galaxySize);
//		}
//		while (root1 == root2);
//
//		pointTo = grn(1, 4);
//		this.setSectorLink(root1, root2, pointTo);

		for (i = 1; i <= galaxySize; i++)
		{
			maxNeighbours = grn(1, 4);

			noMoreChances = false;
			counter = 0;
			while (this.countNeighbours(this.sectors[i]) < maxNeighbours && !noMoreChances)
			{
				if (counter > 10)
				{
					noMoreChances = true;
				}

				counter++;
				newNeighbour = grn(i, galaxySize);
				pointTo = grn(1, 4);
				if (!this.hasNeighbourSector(this.sectors[i], pointTo) && !this.alreadyHasSector(this.sectors[i], newNeighbour) && !this.sectorWasUsed(i, newNeighbour))
				{
					this.setSectorLink(i, newNeighbour, pointTo);
				}
			}
		}

		console.log(this.sectors);
	};

	this.generateGalaxy = function()
	{
		var i, j, isValidPosition;

		for (i = 0; i < this.galaxySize; i++)
		{
			this.sectors[i] = {};

			do
			{
				this.sectors[i].x = grn(1000, 99000);
				this.sectors[i].y = grn(1000, 99000);

				isValidPosition = true;
				for (j = 0; j < i; j++)
				{
					if (Math.abs(this.sectors[i].x - this.sectors[j].x) < 1000 || Math.abs(this.sectors[i].y - this.sectors[j].y) < 1000)
					{
						isValidPosition = false;
					}
				}
			}while (!isValidPosition);
		}

		var xml = new XMLHttpRequest();
		xml.open('POST', '/ships/ajax/putGalaxy.php', false);
		xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xml.send('sectors=' + JSON.stringify(this.sectors));

		this.generateMap();
	};

	this.generateMap = function()
	{
		var i, numberOfAsteroids, numberOfBuildings, S, Asteroids = [], BuildingsArr = [];

		for (var sector = 1; sector < this.galaxySize; sector++)
		{
			var BuildingTypesCounter = {};
			for(i in Buildings)
			{
				BuildingTypesCounter[i] = 1;
			}
			numberOfAsteroids = grn(200, 700);
			numberOfBuildings = 2;

			S = new Stars(mapSize, mapSize, grn(1000, 3500));

			for (i = 0; i < numberOfAsteroids; i++)
			{
				var x, y, type, done, counter = 0;

				do
				{
					done = true;
					counter++;
					x = grn(1, mapSize);
					y = grn(1, mapSize);
					type = grn(0, 5);

					var Astro = new Asteroid(x, y, type);
					for (j = 0; j < i; j++)
					{
						if (Asteroids[j].isCloseToAsteroid(Astro))
						{
							done = false;
						}
					}
				}
				while (!done);

				Asteroids[i] = Astro;
				Asteroids[i].createVertices();
			}

			for (i = 0; i < numberOfBuildings; i++)
			{
				var x, y, buildingType = grn(1,2), done;

				do
				{
					done = true;
					x = grn(1, mapSize - 500);
					y = grn(1, mapSize - 500);

					var BuildingObj = new Building(x, y, buildingType, BuildingTypesCounter[buildingType]);
					for (j = 0; j < i; j++)
					{
						if (BuildingsArr[j].isCloseToBuilding(BuildingObj))
						{
							done = false;
						}
					}

					for (j = 0; j < numberOfAsteroids; j++)
					{
						if (BuildingObj.isCloseToAsteroid(Asteroids[j]))
						{
							done = false;
						}
					}
				}
				while (!done);

				BuildingTypesCounter[buildingType]++;
				BuildingsArr[i] = BuildingObj;
			}

			saveData(sector, 1, S);
			saveData(sector, 2, Asteroids);
			saveData(sector, 3, BuildingsArr);
		}
	};
}