USE uob;

INSERT into department (name) VALUES ("Marketing");
INSERT into department (name) VALUES ("Engineering");
INSERT into department (name) VALUES ("Education");
INSERT into department (name) VALUES ("HR");

INSERT into role (title, salary, department_id) VALUES ("Doctor", 250000, "1");
INSERT into role (title, salary, department_id) VALUES ("Full Stack Developer", 60000, "2");
INSERT into role (title, salary, department_id) VALUES ("Manager", 200000, "3");
INSERT into role (title, salary, department_id) VALUES ("Engineer", 300000, "4");


INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Ali", "wisk", 1, 1);
INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Mahdi", "abdi", 2, 2);
INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("John H.", "Patterson", 3, 3);
INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Thom", "Parker", 4, NULL);
