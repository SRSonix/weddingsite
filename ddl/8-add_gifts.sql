CREATE TABLE gift (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    type ENUM('fix_price', 'up_to_price', 'open_price') NOT NULL,
    price_euro INT,
    amount INT,
    title_en TEXT NOT NULL,
    title_de TEXT,
    title_es TEXT,
    CONSTRAINT chk_amount CHECK (
        (type = 'up_to_price' AND amount IS NULL AND price_euro IS NOT NULL) OR
        (type = 'fix_price' AND amount IS NOT NULL AND price_euro IS NOT NULL) OR
        (type = 'open_price' AND amount IS NULL AND price_euro IS NULL)
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

INSERT INTO gift (type, price_euro, amount, title_en, title_de, title_es) VALUES
('up_to_price', 1000, NULL, "Donation for honeymoon on Cozumel", "Spende für die Flitterwochen auf Cozumel", "Donación para la luna de miel en Cozumel"),
('open_price', NULL, NULL, "Donation for furnishing our new flat (2026)", "Spende zur Einrichtung unserer neuen Wohnung (2026)", "Donación para amueblar nuestro nuevo piso (2026)"),
('fix_price', 65, 8, "Scuba diving", "Tauchen", "Buceo"),
('fix_price', 60, 3, "Couple's massage", "Paarmassage", "Masaje para pareja"),
('up_to_price', 500, NULL, "Cookies & cream Michelin dinner", "Cookies & Cream Michelin Abendessen", "Cena Michelin de Cookies & Cream"),
('up_to_price', 500, NULL, "Haoma Michelin dinner", "Haoma-Michelin Abendessen", "Cena Michelin de Haoma"),
('up_to_price', 250, NULL, "Getvoila voucher", "Getvoila Gutschein", "Vale de Getvoila"),
('up_to_price', 250, NULL, "Hello Fresh voucher", "Hello-Fresh Gutschein", "Vale de Hello Fresh"),
('fix_price', 30, 50, "Hotel room in Thailand/Vietnam", "Hotelzimmer in Thailand/Vietnam", "Habitación de hotel en Tailandia/Vietnam");