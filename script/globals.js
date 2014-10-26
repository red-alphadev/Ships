const friction = 0.95;
const mapSize = 16000;
const GALAXYSIZE = 32;

var keyPressed = [], keyValue;
var mouseX = 0, mouseY = 0, mouseClick = false;

var itemNames = {0: 'Hydrogen', 1: 'Iron', 2: 'Silicone', 3: 'Titanium', 4: 'Ice',
	10: 'Energy Cell',
	101: 'Laser 1', 102: 'Laser 2',
	201: 'Mining Laser 1', 202: 'Mining Laser 2', 205: 'Birthcham Laser 2', 209: 'Best Mining Co. 1',
	301: 'Shield 1', 302: 'Shield 2',
	9999: 'Credits'};

var itemWeights = {0: 1, 1: 3, 2: 2, 3: 4, 4: 2,
	10: 1,
	101: 75, 102: 75, 103: 70, 104: 60, 105: 50, 106: 45, 107: 45, 108: 40, 109: 40, 110: 30,
	201: 100, 202: 95, 203: 90, 204: 85, 205: 80, 206: 80, 207: 70, 208: 65, 209: 60, 210: 50,
	301: 100, 302: 100, 303: 90, 304: 90, 305: 80, 306: 70, 307: 60, 308: 50, 309: 50, 310: 40,
	9999: 0};

var itemMediumPrices = {0: 2, 1: 3, 2: 2, 3: 4, 4: 1,
	10: 5,
	101: 2500, 102: 10000, 103: 25000, 104: 50000, 105: 150000, 106: 450000, 107: 1000000, 108: 15000000, 109: 45000000, 110: 150000000,
	201: 500, 202: 5000, 203: 15000, 204: 50000, 205: 100000, 206: 600000, 207: 1500000, 208: 20000000, 209: 100000000, 210: 250000000,
	301: 5000, 302: 15000, 303: 45000, 304: 150000, 305: 800000, 306: 2500000, 307: 15000000, 308: 50000000, 309: 150000000, 310: 400000000,
	9999: 0};

var Buildings = {
	1: {
		name: 'Solar Power Plant',
		vertices: [0, 0, 100, 0, 100, 40, 150, 40, 150, 0, 250, 0, 250, 100, 150, 100, 150, 60, 100, 60, 100, 100, 0, 100],
		itemsRequired: [{id: 4, time: 1000, lastUsedTime: 0}, {id: 3, time: 2500, lastUsedTime: 0}],
		itemsCreated: [{id: 10, time: 5000, lastCreatedTime: 0}]
	}
};

var canvasWidth = 0, canvasHeight = 0;