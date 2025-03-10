CREATE TABLE metaphor_enemies (
    id INTEGER,
    "Enemy Name Internal" TEXT,
    "Enemy Name" TEXT,
    level INTEGER,
    hp INTEGER,
    mp INTEGER,
    strength INTEGER,
    magic INTEGER,
    endurance INTEGER,
    agility INTEGER,
    luck INTEGER,
    slash TEXT,
    pierce TEXT,
    strike TEXT,
    fire TEXT,
    ice TEXT,
    elec TEXT,
    wind TEXT,
    light TEXT,
    dark TEXT,
    almighty TEXT
);

CREATE TABLE p3_enemies (
    id INTEGER,
    race TEXT,
    level INTEGER,
    name TEXT,
    hp INTEGER,
    mp INTEGER,
    sword TEXT,
    strike TEXT,
    gun TEXT,
    fire TEXT,
    ice TEXT,
    elec TEXT,
    wind TEXT,
    light TEXT,
    dark TEXT,
    almighty TEXT,
    drops TEXT,
    appears TEXT
);

CREATE TABLE p3e_enemies (
    id INTEGER,
    race TEXT,
    level INTEGER,
    name TEXT,
    hp INTEGER,
    mp INTEGER,
    sword TEXT,
    strike TEXT,
    gun TEXT,
    fire TEXT,
    ice TEXT,
    elec TEXT,
    wind TEXT,
    light TEXT,
    dark TEXT,
    almighty TEXT,
    drops TEXT,
    appears TEXT
);

CREATE TABLE p4_enemies (
    id INTEGER,
    race TEXT,
    level INTEGER,
    name TEXT,
    hp INTEGER,
    mp INTEGER,
    phys TEXT,
    fire TEXT,
    ice TEXT,
    elec TEXT,
    wind TEXT,
    light TEXT,
    dark TEXT,
    almighty TEXT,
    drops TEXT,
    appears TEXT
);

CREATE TABLE p5_enemies (
    id INTEGER,
    race TEXT,
    level INTEGER,
    name TEXT,
    hp INTEGER,
    mp INTEGER,
    phys TEXT,
    gun TEXT,
    fire TEXT,
    ice TEXT,
    elec TEXT,
    wind TEXT,
    psychic TEXT,
    nuke TEXT,
    light TEXT,
    dark TEXT,
    almighty TEXT,
    drops TEXT,
    appears TEXT
);

CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(255) NULL
);