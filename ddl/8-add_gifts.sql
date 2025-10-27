CREATE TABLE gift (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    type ENUM('fix_price', 'up_to_price') NOT NULL,
    price_euro INT NOT NULL,
    amount INT,
    title_en TEXT NOT NULL,
    title_de TEXT,
    title_es TEXT,
    CONSTRAINT chk_amount CHECK (
        (type = 'up_to_price' AND amount IS NULL) OR
        (type = 'fix_price' AND amount IS NOT NULL)
    )
);

CREATE TABLE gift_claim(
    user_id INT NOT NULL,
    gift_id INT NOT NULL,
    amount INT NOT NULL,
    PRIMARY KEY (user_id, gift_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (gift_id) REFERENCES gift(id)
);


INSERT INTO gift (type, price_euro, amount, title_en) VALUES
('up_to_price', 2000, NULL, "contribution towards our new flat"),
('up_to_price', 2000, NULL, "contribution towards our honeymoon"),
('fix_price', 65, 8, "scuba diving"),
('fix_price', 60, 3, "couple massage"),
('up_to_price', 500, NULL, "cocoli gift coucher"),
('up_to_price', 2500, NULL, "transport e-bike with children seats"),
('up_to_price', 400, NULL, "coockies & cream dinner (Berlin)"),
('up_to_price', 200, NULL, "stroller"),
('up_to_price', 250, NULL, "getvoila voucher"),
('fix_price', 30, 25, "night accomodation in thailand/vietnam "),
('up_to_price', 500, NULL, "haoma dinner"),
('up_to_price', 500, NULL, "baby bed"),
('fix_price', 100, 1, "baby phone");