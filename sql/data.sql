COPY metaphor_enemies (
id, "Enemy Name Internal", "Enemy Name", level, hp, mp,
strength, magic, endurance, agility, luck,
slash, pierce, strike, fire, ice,
elec, wind, light, dark, almighty
)
FROM '/data/metaphor_enemies.csv'
DELIMITER ','
CSV HEADER;

COPY p3_enemies (
id, race, level, name, hp, mp, sword, strike, gun, fire, ice, elec, wind, light, dark, almighty, drops, appears
)
FROM '/data/p3_enemies.csv'
DELIMITER ','
CSV HEADER;

COPY p3e_enemies (
id, race, level, name, hp, mp, sword, strike, gun, fire, ice, elec, wind, light, dark, almighty, drops, appears
)
FROM '/data/p3e_enemies.csv'
DELIMITER ','
CSV HEADER;

COPY p4_enemies (
id, race, level, name, hp, mp, phys, fire, ice, elec, wind, light, dark, almighty, drops, appears
)
FROM '/data/p4_enemies.csv'
DELIMITER ','
CSV HEADER;


COPY p5_enemies (
    id, race, level, name, hp, mp, phys, gun, fire, ice, elec, wind, psychic, nuke, light, dark, almighty, drops, appears
)
FROM '/data/p5_enemies.csv'
DELIMITER ','
CSV HEADER;