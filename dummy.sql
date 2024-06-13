-- Indsæt dummy data i users tabellen
INSERT INTO users (name, email, password, description, profile_image, role_id) VALUES
('John Doe', 'john@example.com', 'kodeord123', 'Admin bruger', 'default/user.png', 2),
('Jane Smith', 'jane@example.com', 'kodeord456', 'Almindelig bruger', 'default/user.png', 2),
('Alice Johnson', 'alice@example.com', 'kodeord789', 'Ny bruger', 'default/user.png', 2),
('Bob Brown', 'bob@example.com', 'kodeordabc', 'Bilentusiast', 'default/user.png', 2),
('Emily Davis', 'emily@example.com', 'kodeorddef', 'Mekaniker lærling', 'default/user.png', 2),
('Emil Andersen', 'emil@storgaardandersen.dk', '$2b$10$u7evfJwQBKuUpZY5gOH85OjEZVpWLipaqWKABqVPKulZ2zGkMsvXC', 'Hej med dig', 'default/user.png', 2),
('Admin', 'admin@admin.dk', '$2b$10$u7evfJwQBKuUpZY5gOH85OjEZVpWLipaqWKABqVPKulZ2zGkMsvXC', 'Hej med dig', 'default/user.png', 1);

-- Indsæt dummy data i car tabellen
INSERT INTO car (user_id, brand, motor, first_registration, model, type, license_plate, vin, image) VALUES
(1, 'Toyota', '1.6L', '2020-01-01', 'Corolla', 'Sedan', 'ABC123', 'VIN123', 'default/car.png'),
(2, 'Honda', '2.0L', '2018-05-15', 'Civic', 'Hatchback', 'XYZ456', 'VIN456', 'default/car.png'),
(3, 'Ford', '1.8L', '2019-08-20', 'Focus', 'Sedan', 'DEF789', 'VIN789', 'default/car.png'),
(4, 'Chevrolet', '2.2L', '2017-11-10', 'Cruze', 'Sedan', 'GHI012', 'VIN012', 'default/car.png'),
(5, 'BMW', '2.5L', '2021-03-05', '3 Serien', 'Sedan', 'JKL345', 'VIN345', 'default/car.png');

-- Indsæt dummy data i post tabellen
INSERT INTO post (user_id, title, description, car_brand, car_motor, car_first_registration, car_model, car_type, category_id) VALUES
(1, 'Motor Problem', 'Har nogle problemer med motoren, har brug for råd.', 'Toyota', '1.6L', '2020-01-01', 'Corolla', 'Sedan', 1),
(2, 'Udskiftning af Bremser', 'Behov for anbefalinger til nye bremser.', 'Honda', '2.0L', '2018-05-15', 'Civic', 'Hatchback', 3),
(3, 'Gearkasse Problem', 'Oplever problemer med gearskifte.', 'Ford', '1.8L', '2019-08-20', 'Focus', 'Sedan', 2),
(4, 'Affjedrings Støj', 'Hører mærkelige lyde, når jeg kører over bump.', 'Chevrolet', '2.2L', '2017-11-10', 'Cruze', 'Sedan', 4),
(5, 'Advarselslampe på Instrumentbrættet', 'Har brug for hjælp til at tolke en advarselslampe.', 'BMW', '2.5L', '2021-03-05', '3 Serien', 'Sedan', 1);

-- Indsæt dummy data i comment tabellen
INSERT INTO comment (description, solution, user_id, post_id, parent_id) VALUES
('Har du tjekket oliestanden for nylig?', 0, 3, 1, NULL),
('Overvej at få renset brændstofinjektorerne.', 0, 4, 1, NULL),
('Du skal muligvis udskifte luftfilteret.', 1, 5, 1, NULL),
('Prøv at bruge en brændstofsystemrens.', 0, 2, 1, NULL),
('Det kunne være et problem med tændspolen.', 0, 1, 1, NULL),
('Overvej at få en professionel diagnosticering.', 0, 3, 2, NULL),
('Tjek om rotorerne også er slidte.', 1, 4, 2, NULL),
('Du skal bløde bremseledningerne efter udskiftning.', 0, 5, 2, NULL),
('Overvej at opgradere til performance bremseklodser.', 0, 2, 2, NULL),
('Sørg for, at bremsekalibrene er smurt ordentligt.', 0, 1, 2, NULL),
('Prøv at skifte gearolie og filter.', 0, 3, 3, NULL),
('Overvej at få serviceret gearkassen.', 1, 4, 3, NULL),
('Tjek for eventuelle lækager i gearkassesystemet.', 0, 5, 3, NULL),
('Det kunne være tid til en gearkasse skylning.', 0, 2, 3, NULL),
('Sørg for, at gearkassebeslagene er sikre.', 0, 1, 3, NULL),
('Undersøg affjedringsbøsningerne for slid.', 0, 3, 4, NULL),
('Overvej at opgradere til eftermarkedet affjedringsdele.', 1, 4, 4, NULL),
('Tjek om krængningsstabilisatorens endestykker er løse.', 0, 5, 4, NULL),
('Du skal muligvis udskifte kontrolarmsbøsningerne.', 0, 2, 4, NULL),
('Overvej at opgradere til coilover affjedring.', 0, 1, 4, NULL),
('Få læst fejlkoderne for at finde problemet.', 0, 3, 5, NULL),
('Tjek om nogen sikringer relateret til advarselslampen er sprunget.', 1, 4, 5, NULL),
('Sørg for, at alle elektriske forbindelser er sikre.', 0, 5, 5, NULL),
('Overvej at nulstille advarselslampen på instrumentbrættet.', 0, 2, 5, NULL),
('Tjek om generatoren oplader korrekt.', 0, 1, 5, NULL);

-- Indsæt dummy data i post_image tabellen
INSERT INTO post_image (image, post_id) VALUES
('default/post.png', 1),
('default/post.png', 2),
('default/post.png', 3),
('default/post.png', 4),
('default/post.png', 5);
