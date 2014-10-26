<?php

include('../../../inc/common.php');

global $db;

$sql = sprintf("SELECT sectorName, sectorX, sectorY FROM shipsSectors WHERE userId = %d", 1);
$rows = $db->fetch_all_array($sql);

if (count($rows))
{
    echo json_encode($rows);
    exit(0);
}
