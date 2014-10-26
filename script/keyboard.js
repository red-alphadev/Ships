function doKeyDown(e)
{
    keyPressed[e.keyCode] = true;
	keyValue = e.keyCode;

	if (keyValue == 8 || keyValue == 117)
	{
		e.preventDefault();
	}
}

function doKeyUp(e)
{
    keyPressed[e.keyCode] = false;
	keyValue = 0;
}