<?php

namespace InfoRepository;

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
            CASE WHEN type = 'up_to_price' THEN price_euro - claimed_amount_filled END AS price_euro_left,
            CASE WHEN type = 'fix_price' THEN amount - claimed_amount_filled END AS amount_left
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