<?php 
    $requestPayload = file_get_contents("php://input");
    $requestPayload = json_decode($requestPayload);
    $structure = $requestPayload->structure;
    $qid = $requestPayload->qid;
    $questions = $requestPayload->questions;
    $formId = $requestPayload->formId;
    $apiKey = $requestPayload->apiKey;

    $data = array(
        "cards" => array(),
        "columns" => array(),
        "columnOrder" => array()
    );

    // $data["columnOrder"] = $structure;
    $columnCount = sizeof($structure);

    for ($i = 0; $i < $columnCount; $i++) {
        $newColumn = array(
            "id" => "column-$i",
            "title" => $structure[$i],
            "cardIds" => array()
        );

        $data["columns"]["column-$i"] = $newColumn;
        array_push($data["columnOrder"], "column-$i");
    }

    include getcwd() . '/jotform-api-php/JotForm.php';
    $jotformAPI = new JotForm($apiKey);
    $submissions = ($jotformAPI->getFormSubmissions($formId));


    $cardCount = sizeof($submissions);
    for ($i = 0; $i < $cardCount; $i++) {
        $answers = $submissions[$i]["answers"];
        $sid = $submissions[$i]["id"];
        $content = "";
        // $column = $answers[$i][]
        $column = $submissions[$i]["answers"][$qid]["answer"];

        // echo json_encode($data["columns"]) . "</br>";        
        
        for ($j = 0; $j < $columnCount; $j++) {
            if ($data["columns"]["column-$j"]["title"] == $column) {
                $columnId = "column-$j";
                array_push($data["columns"][$columnId]["cardIds"], "card-$i");
            } else if (empty($column) == 1) {
                $columnId = "column-0";
                $column = "Uncategorized";
                array_push($data["columns"][$columnId]["cardIds"], "card-$i");
            }
        }


        foreach($answers as $key => $answer) {
            if ($key != $qid) {
                $content = $content . $answer["answer"];
            }
        }


        $newCard = array(
            "id" => "card-$i",
            "content" => $content,
            "sid" => $sid,
            "column" => $column
        );

        array_push($data["cards"], $newCard);
    }    

    $result = Array(
        "data" => $data,
        "qid" => $qid,
        "fid" => $formId,
        "questions" => $questions
    );

    echo json_encode($result);
?>