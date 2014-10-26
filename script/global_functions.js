function grn(min, max)
{
    if (min > max)
    {
        var t = min;
        min = max;
        max = t;
    }
    return Math.floor(min + Math.random() * (max - min));
}

function isEmptyObject(obj)
{
    return JSON.stringify(obj) == '{}';
}

function saveData(sector, type, objArray)
{
	var xml = new XMLHttpRequest();
	xml.open('POST', '/ships/ajax/saveData.php', false);
	xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");

	xml.send('sector=' + sector + '&json=' + JSON.stringify(objArray) + '&type=' + type);

	return xml.responseText;
}

function getData(sector, type)
{
	var xml = new XMLHttpRequest();
	xml.open('POST', '/ships/ajax/getData.php', false);
	xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xml.send('sector=' + sector + '&type=' + type);

	return xml.responseText;
}

function getSectors()
{
	var xml = new XMLHttpRequest();
	xml.open('GET', '/ships/ajax/getSectors.php', false);
	xml.send();

	var sectors = JSON.parse(xml.responseText);

	for(var i = 0; i < sectors.length; i++)
	{
		sectors[i].sectorX = Math.floor(sectors[i].sectorX / 100000 * canvasWidth);
		sectors[i].sectorY = Math.floor(sectors[i].sectorY / 100000 * canvasHeight);
	}

	return sectors;
}