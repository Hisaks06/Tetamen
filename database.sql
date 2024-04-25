CREATE TABLE role (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

INSERT INTO role (name) VALUES
    ('admin'),
    ('student'),
    ('teacher'),
    ('guest');

CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT,
    password TEXT NOT NULL,
    idRole INTEGER NOT NULL,
    idKlasse INTEGER NOT NULL,
    FOREIGN KEY (idKlasse) REFERENCES klasse(id),
    FOREIGN KEY(idRole) REFERENCES role(id)
);

INSERT INTO user (id, username, firstname, lastname, email, password, idKlasse, idRole) VALUES
( '1', 'Hisaks', 'Heine', 'Isaksen', 'heine.isaksen06@gmail.com', '$2b$10$lhpfzhrALVQreswVI9E4ReoLVpcKEeHjaVKEsKgxf8UClr1kZ0Tom', 2, 1),
( '2', 'Blixt', 'Odd Erik', 'Blixt Haaskjold', 'moraknuller53@gmail.com', '$2b$10$wRHBFbhgQR5zb.JGTBnxJeWJ4cUddR7LB55WhU/F78syY/pzfMQoS', 3, 2);

CREATE TABLE klasse (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

INSERT INTO klasse (name) VALUES
    ('VG1'),
    ('VG2'),
    ('VG3'),
    ('Staff');