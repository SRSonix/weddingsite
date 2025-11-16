<?php

namespace GiftRepository;

function create_db_session() {
    $servername = DB_SERVER;
    $username = DB_USER;
    $password = DB_PASSWORD;
    $dbname = DB_NAME;

    try {
        $session = new \PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $session->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    }
    catch (\PDOException  $e) {
        _log($e->getMessage());
        return NULL;
    }

    return $session;
}


function get_gifts() {
    $session = create_db_session();
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    } 
    
    $stmt = $session->prepare(<<<EOD
        WITH claimed AS (
            SELECT gift_id AS id, SUM(amount) as claimed_amount
            FROM gift_claim 
            GROUP BY gift_id
        ),
        joined AS (
            SELECT 
                gift.*, 
                COALESCE(claimed.claimed_amount, 0) as claimed_amount_filled
            FROM gift 
            LEFT OUTER JOIN claimed
            ON claimed.id = gift.id
        )

        SELECT 
            id, type, price_euro, amount, title_en, title_de, title_es,
            CAST( CASE WHEN type = 'up_to_price' THEN price_euro - claimed_amount_filled END AS SIGNED INT) AS price_euro_left,
            CAST( CASE WHEN type = 'fix_price' THEN amount - claimed_amount_filled END AS SIGNED INT) AS amount_left
        FROM joined;
    EOD);
    $stmt->execute();
    $result = $stmt->fetchAll();
    
    if (count($result) == 0){
        _log("no result found");
        return [];
    }

    $session = null;
    
    return array_map(
        fn($row) => new \Gift($row),
        $result
    );
}


function get_gift_claim_amount($user_id, $gift_id){
    $session = create_db_session();
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }
 
    try {
        $stmt = $session->prepare("SELECT * FROM gift_claim WHERE user_id = :user_id AND gift_id = :gift_id;");
        $stmt->execute(["user_id"=>$user_id, "gift_id"=>$gift_id]);
        $result = $stmt->fetch();
    }
    catch(\PDOException $e)
    {
        _log($e);
        $session = null;
        http_response_code(response_code: 422);
        return ["msg"=>"error getting gift_claim"];
    }

    $session = null;

    if ($result){
        return $result["amount"]; 
    }
    else{
        return 0;
    }
}

function get_gift_claims($user_id){
    $session = create_db_session();
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }
 
    try {
        $stmt = $session->prepare("SELECT * FROM gift_claim WHERE user_id = :user_id;");
        $stmt->execute(["user_id"=>$user_id]);
        $result = $stmt->fetchAll();
    }
    catch(\PDOException $e)
    {
        _log($e);
        $session = null;
        http_response_code(response_code: 422);
        return ["msg"=>"error getting gift_claim"];
    }

    $session = null;

    $gift_claims = [];
    foreach ($result as $row){
        $gift_claims[] = new \GiftClaim($row["user_id"], $row["gift_id"], $row["amount"]);
    }

    return $gift_claims;
}

function upsert_gift_claim(\GiftClaim $gift_claim){
    $session = create_db_session();
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }

    try{
        $session->exec("SET autocommit=0");
        $session->exec("LOCK TABLES gift_claim WRITE, gift READ");

        $stmt = $session->prepare("DELETE FROM gift_claim WHERE user_id = :user_id AND gift_id = :gift_id;");
        $stmt->execute(["user_id" => $gift_claim->user_id, "gift_id" => $gift_claim->gift_id]);

        $stmt = $session->prepare(<<<EOD
            WITH claimed AS (
                SELECT gift_id AS id, SUM(amount) as claimed_amount
                FROM gift_claim 
                GROUP BY gift_id
            ),
            joined AS (
                SELECT 
                    gift.*, 
                    COALESCE(claimed.claimed_amount, 0) as claimed_amount_filled
                FROM gift 
                LEFT OUTER JOIN claimed
                ON claimed.id = gift.id
            ),
            amount_left AS (
                SELECT 
                    type AS gift_type,
                    CASE 
                        WHEN type = 'up_to_price' THEN price_euro 
                        WHEN type = 'fix_price' THEN amount 
                        ELSE  0
                    END - claimed_amount_filled AS amount_left
                FROM joined
                WHERE id = :gift_id
            )
            SELECT 
                CASE
                    WHEN gift_type = 'open_price' THEN TRUE
                    ELSE amount_left >= :new_amount
                END AS can_upsert
            FROM amount_left;
        EOD);
        $stmt->execute(["gift_id"=>$gift_claim->gift_id, "new_amount"=> $gift_claim->amount]);
        $can_upsert = $stmt->fetchAll()[0]["can_upsert"];

        _log("can_upsert $can_upsert;");
        if ($can_upsert){
            $stmt = $session->prepare("INSERT INTO gift_claim (user_id, gift_id, amount) VALUES (:user_id, :gift_id, :amount);");
            $stmt->execute(["user_id"=>$gift_claim->user_id, "gift_id"=>$gift_claim->gift_id, "amount"=>$gift_claim->amount]);

            $session->exec("COMMIT");
            $success = true;
        }
        else {
            $session->exec("ROLLBACK");
            $success = false;
        }
    }
    catch(\PDOException $e){
        _log($e);
        $session->exec("ROLLBACK");
        throw $e;
    }
    finally {
        $session->exec("UNLOCK TABLES");
        $session->exec("SET autocommit=1");
        $session = null;
    }

    return $success;
}

function remove_gift_claim($user_id, $gift_id){
    _log("removing gift claim");
    $session = create_db_session();
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }

    try {
        $stmt = $session->prepare("DELETE FROM gift_claim WHERE user_id = :user_id AND gift_id = :gift_id;");
        $stmt->execute(["user_id"=>$user_id, "gift_id"=>$gift_id]);
        $deletedRows = $stmt->rowCount();
        _log("succesfully removied $deletedRows gift claims");
    }
    catch(\PDOException $e)
    {
        _log($e);
        $session = null;
        return false;
    }

    $session = null;

    return true;
}
