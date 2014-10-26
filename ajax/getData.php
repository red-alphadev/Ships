<?php

include('../../../inc/common.php');

if ($_POST && isset($_POST['sector']) && isset($_POST['type']))
{
    global $db;
    $sector = mysql_real_escape_string($_POST['sector']);
    $dataType = mysql_real_escape_string($_POST['type']);

    $sql = sprintf("SELECT dataJson FROM gameData WHERE userId = %d AND sector = %d AND dataType = %d", 1, $sector, $dataType);
    $rows = $db->fetch_all_array($sql);

    if (count($rows) == 1)
    {
//        $res = '';
//        for($i = 0; $i < 128000; $i++)
//        {
//            $res .= '0';
//        }
        echo stripslashes($rows[0]['dataJson']);
//        echo $res;
        exit(0);
    }

    echo '-1';
}