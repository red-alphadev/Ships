window.onload = function(){
    var canvas = document.getElementById('myCanvas');
    var c = canvas.getContext('2d');
    canvasWidth = canvas.width; canvasHeight = canvas.height;

    document.addEventListener("keydown", doKeyDown, true);
    document.addEventListener("keyup", doKeyUp, true);

    canvas.addEventListener('mousedown', doMouseDown, true);
    canvas.addEventListener('mousemove', doMouseMove, true);
    canvas.addEventListener('mouseup', doMouseUp, true);
    canvas.addEventListener('contextmenu', function(e) {
         if (e.button === 2) {
          e.preventDefault();
           return false;
         }

		return true;
     }, false);

	var map = new galaxy();
	map.generateGalaxy();

    var frameCountTimer = 0, fps = 0, sector = 0;
	var stars;
    var Area = {x: mapSize, y: mapSize}, numberOfAsteroids, numberOfBuildings, areBuildingsClose = false, isAsteroidClose, i, j;
    var TextObj = {};
    var S = {};
    var ship = new Ship(7500, 7500);
    var Asteroids = [], closeAsteroids = [], BuildingsArr = [], closeBuildings = [];
    var Sparks = [], shots = [], pulse = {};
    var PanelObj, conObj = new Context(), TravelObj = {};
    var mT = new MouseTracking();

	function loadData(sector)
	{
		var response, tmp;
		S = [];
		Asteroids = [];
		BuildingsArr = [];

		response = getData(sector, 1);
		if (response && response != '-1')
		{
			S = new Stars(1, 1, 1);
			tmp = JSON.parse(response);
			S.reBuild(tmp);
		}
		else
		{
			S = [];
			return false;
		}

		response = getData(sector, 2);
		if (response && response != '-1')
		{
			tmp = JSON.parse(response);
			for(i = 0; i < tmp.length; i++)
			{
				Asteroids[i] = new Asteroid(1, 1, 1);
				Asteroids[i].reBuild(tmp[i]);
			}

			numberOfAsteroids = tmp.length;
		}
		else
		{
			S = [];
			Asteroids = [];
			return false;
		}

		response = getData(sector, 3);
		if (response && response != '-1')
		{
			tmp = JSON.parse(response);
			for (i = 0; i < tmp.length; i++)
			{
				BuildingsArr[i] = new Building(1, 1, 1, 1);
				BuildingsArr[i].reBuild(tmp[i]);
			}
		}
		else
		{
			S = [];
			Asteroids = [];
			BuildingsArr = [];

			return false;
		}

//		response = getData(sector, 4);
//		if (response && response != '-1')
//		{
//			tmp = JSON.parse(response);
//			ship.reBuild(tmp);
//		}
//		else
//		{
//			return false;
//		}

		return true;
	}

    function runEngine(time)
    {
		var askAnimFrame = true;

        c.fillStyle = 'black';
        c.fillRect(0, 0, canvasWidth, canvasHeight);

        c.font = '10px Verdana';
        c.fillStyle = 'white';
        c.fillText('Time: ' + Math.round(time) + '('+ Math.round(fps) +')', canvasWidth - 150, 10);

        fps = 1000 / (time - frameCountTimer);

        S.draw(c, ship.getX(), ship.getY());

        if (ship)
        {
			if (keyPressed[117])
			{
				keyPressed[117] = false;
				saveData(sector, 1, S);
				saveData(sector, 2, Asteroids);
				saveData(sector, 3, BuildingsArr);
				saveData(sector, 4, ship);

				TextObj = new Text('Game saved', time);
			}

            if (keyPressed[73])
            {
                keyPressed[73] = false;
                ship.getInventory().changeViewState();
            }

			if (keyPressed[67])
			{
				keyPressed[67] = false;
				ship.getCharacterScreen().changeViewState();
			}

			if (keyPressed[78])
			{
				keyPressed[78] = false;
				ship.changeFireMode();
			}

			if (keyPressed[77])
			{
				keyPressed[77] = false;
				stars = new starMap();
				stars.loadMap();
				starMapAnimate(0);

				askAnimFrame = false;
			}

            if (keyPressed[84])
            {
                keyPressed[84] = false;
                if (PanelObj != null)
                {
                    PanelObj = null;
                }
            }

			if (conObj.getViewStatus() && (keyValue >= 48 && keyValue <= 58))
			{
				quantity = conObj.getQuantity();
				if (quantity.toString().length < 7)
				{
					quantity = quantity * 10 + (keyValue - 48);
					conObj.setQuantity(quantity);
				}

				keyValue = 0;
			}else if (conObj.getViewStatus() && keyValue == 8)
			{
				quantity = conObj.getQuantity();
				if (quantity != 0)
				{
					quantity = Math.floor(quantity / 10);
					conObj.setQuantity(quantity);
				}

				keyValue = 0;
			}

            isAsteroidClose = false;
            for (i = 0; i < numberOfAsteroids; i++)
            {
                if (Asteroids[i].isCloseTo(ship.getX(), ship.getY()))
                {
                    isAsteroidClose = true;

                    if (PanelObj == null || !PanelObj.getViewStatus())
                    {
                        Asteroids[i].draw(c, ship.getX(), ship.getY());
                    }
                    closeAsteroids.push(Asteroids[i]);
                }
            }

            if (isAsteroidClose)
            {
                c.fillStyle = 'blue';
                c.fillText('Asteroid close by', ship.getCanvasX() - 50, ship.getCanvasY() + 40);
            }


            areBuildingsClose = false;
            for (i = 0; i < BuildingsArr.length; i++)
            {
                BuildingsArr[i].runProcess(time);
                if (BuildingsArr[i].isCloseTo(c, ship.getX(), ship.getY()))
                {
                    areBuildingsClose = true;

                    if (PanelObj == null || !PanelObj.getViewStatus())
                    {
                        BuildingsArr[i].draw(c, ship.getX(), ship.getY());
                    }
                    closeBuildings.push(BuildingsArr[i]);
                }
            }

            if (mouseClick)
            {
				/*
					When you click an object in the Station Panel
				 */
                if (PanelObj != null && PanelObj.getViewStatus() && conObj.getViewStatus() == false)
                {
					mouseClick = false;

					objClicked = PanelObj.getClickedItem();

					if (objClicked != false)
					{
						conObj.openContextConsole(objClicked, 1, PanelObj.getOperationFromWho());
					}
                }
				/*
					When you click on a Context option
				 */
                else if (PanelObj != null && conObj.getViewStatus())
				{
					mouseClick = false;

					var res = conObj.getSelected();
					if (res !== false)
					{
						var result, quantity;
						/* Sell all */
						if (res == 1)
						{
							quantity = conObj.getItem().getItemQuantity();

						}
						// Sell only a few
						else if (res == 2)
						{
							quantity = conObj.getQuantity();
						}

						result = PanelObj.processOrder(conObj.getItem(), quantity);
						if (conObj.getQuantity() > conObj.getItem().getItemQuantity())
						{
							conObj.setQuantity(conObj.getItem().getItemQuantity());
						}

						if (result.length > 5 && isEmptyObject(TextObj))
						{
							TextObj = new Text(result, time);
						}
					}
					else if (res == false)
					{
						conObj.disableView();
					}
				}
				else if (ship.getInventory().getViewStatus() && !conObj.getViewStatus())
				{
					mouseClick = false;
					objClicked = ship.getInventory().getList().getSelected();

					if (objClicked != false)
					{
						conObj.openContextConsole(objClicked, 2, 0);
					}
				}
				else if (ship.getInventory().getViewStatus() && conObj.getViewStatus())
				{
					mouseClick = false;
					var option = conObj.getSelected();

					if (option && option == 1)
					{
						if (ship.equipItem(conObj.getItem()))
						{
							conObj.disableView();
						}
						else
						{
							TextObj = new Text('Cannot equip item', time);
						}
					}
					else
					{
						conObj.disableView();
					}
				}
				else
                {
                    for (i = 0; i < closeBuildings.length; i++)
                    {
                        if (closeBuildings[i].isClicked(mouseX, mouseY))
                        {
                            PanelObj = new Panel(ship, closeBuildings[i]);
                            PanelObj.init();
                            PanelObj.changeState();
                        }
                    }

                    if (PanelObj == null)
                    {
						if (ship.getFireMode() == 2)
						{
							pulse = new Pulse(ship.getCanvasX(), ship.getCanvasY(), mouseX, mouseY, ship.getCharacterScreen().getMiningLaser().getMiningLaserPower(), 'lightblue', 2);
						}
						else
						{
							var sh = ship.fire(time);
							for(i = 0; i < sh.length; i++)
							{
								shots.push(sh[i]);
							}
						}
                    }
                }
            }

            if (PanelObj == null || !PanelObj.getViewStatus())
            {
                ship.move(c, Area.x, Area.y, keyPressed);

				if (!ship.getInventory().getViewStatus())
				{
					if (conObj.getViewStatus())
					{
						conObj.disableView();
					}
				}
            }
        }
        else
        {
            c.font = '16px Verdana';
            c.fillStyle = 'red';
            c.fillText('The end!', canvas.width / 2, canvas.height / 2);
        }

        if (shots.length)
        {
            for(i = 0; i < shots.length; i++)
            {
                shots[i].move(c, ship.getX(), ship.getY());

                if (shots[i] && shots[i].isOutofBounds())
                {
                    shots.splice(i, 1);
                }
            }
        }

		if (!isEmptyObject(pulse))
		{
			for(j = 0; j < closeAsteroids.length; j++)
			{
				if (closeAsteroids[j].isHitByPoint(mouseX, mouseY))
				{
					pulse.draw(c, closeAsteroids[j]);
					Sparks.push(new Spark(mouseX, mouseY));

					var amountMine = closeAsteroids[j].mineAmount(pulse.getPower()), newItemObj;

					if (amountMine > 0)
					{
						newItemObj = new Item(closeAsteroids[j].getType(), amountMine);
						newItemObj.setCanSell(true);
						if (!ship.getInventory().addItem(newItemObj))
						{
							if (isEmptyObject(TextObj))
							{
								TextObj = new Text('Inventory is full', time);
							}
						}
						else
						{
							closeAsteroids[j].removeAmount(amountMine);
						}
					}
				}
			}
			pulse = {};
		}

        for(i = 0; i < Sparks.length; i++)
        {
            if (Sparks[i].getState() == 1)
            {
                Sparks.splice(i, 1);
            }
            else
            {
                Sparks[i].animate(c);
            }
        }

        if (PanelObj != null)
        {
            PanelObj.draw(c);
        }

		conObj.draw(c);

        if (!isEmptyObject(TextObj))
        {
            TextObj.draw(c, time);

            if (TextObj.isDone())
            {
                TextObj = {};
            }
        }
        mT.draw(c, mouseX, mouseY);

        closeAsteroids = [];
        closeBuildings = [];
        frameCountTimer = time;

		if (askAnimFrame)
		{
			requestAnimationFrame(runEngine, canvas);
		}
    }

	function travelAnimation(time)
	{
		if (isEmptyObject(TravelObj))
		{
			TravelObj = new Travel();
		}

		TravelObj.draw(c);

		if (TravelObj.isDone())
		{
			runEngine(0);
			TravelObj = {};
		}
		else
		{
			requestAnimationFrame(travelAnimation, canvas);
		}
	}

	function starMapAnimate(time)
	{
		var requestAnimation = true, newSector = false;

		c.fillStyle = 'black';
		c.fillRect(0, 0, canvasWidth, canvasHeight);

		stars.draw(c);
		if (mouseClick)
		{
			mouseClick = false;
			newSector = stars.getSelectedSector();

			if (newSector !== false)
			{
				saveData(sector, 1, S);
				saveData(sector, 2, Asteroids);
				saveData(sector, 3, BuildingsArr);
				sector = newSector;
				requestAnimation = false;
				travelAnimation(0);
			}
		}

		if (keyPressed[77])
		{
			keyPressed[77] = false;
			requestAnimation = false;
			runEngine(0);
		}

		mT.draw(c);

		if (requestAnimation)
		{
			requestAnimationFrame(starMapAnimate, time);
		}
		else
		{
			stars = {};
			if (newSector !== false)
			{
				loadData(newSector);
			}
		}
	}

	loadData(sector);
	runEngine(0);
};