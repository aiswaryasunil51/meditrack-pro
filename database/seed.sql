
INSERT INTO drug_categories (category_name, description)
VALUES ('Analgesic', 'Pain relief'), ('Antibiotic', 'Bacterial infection treatment');

INSERT INTO manufacturers (name, location, contact_info)
VALUES ('PharmaCorp Ltd', 'Mumbai', 'contact@pharmacorp.com');

INSERT INTO suppliers (name, email, phone)
VALUES ('MediLife Pvt Ltd', 'info@medilife.com', '+91-9876543210');

INSERT INTO drugs (name, category_id, manufacturer_id, unit_price)
VALUES ('Paracetamol', 1, 1, 2.50);
