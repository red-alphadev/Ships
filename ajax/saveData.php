<?
include('../../../inc/common.php');

if ($_POST && isset($_POST['sector']) && isset($_POST['type']) && isset($_POST['json']))
{
    global $db;
    $sector = mysql_real_escape_string($_POST['sector']);
    $dataType = mysql_real_escape_string($_POST['type']);
    $dataJson = mysql_real_escape_string($_POST['json']);

    $sql = sprintf("SELECT id FROM gameData WHERE userId = %d AND sector = %d AND dataType = %d", 1, $sector, $dataType);
    $rows = $db->fetch_all_array($sql);

    if (count($rows) == 0)
    {
        $data = array(
            'userId' => 1,
            'sector' => $sector,
            'dataType' => $dataType,
            'dataJson' => $dataJson,
            'createdDate' => date('Y-m-d H:i:s'),
            'modifiedDate' => date('Y-m-d H:i:s')
        );
        $result = $db->query_insert('gameData', $data);

        if ($result !== false)
        {
            echo strlen($_POST['json']);
            exit(0);
        }
    }
    else
    {
        $data = array(
            'userId' => 1,
            'dataType' => $dataType,
            'dataJson' => $dataJson,
            'modifiedDate' => date('Y-m-d H:i:s')
        );
        $db->query_update('gameData', $data, sprintf('userId = %d and sector = %d and dataType = %d', 1, $sector, $dataType));

        echo strlen($_POST['json']);
        exit(0);
    }

    echo '-1';
}