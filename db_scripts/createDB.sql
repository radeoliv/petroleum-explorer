-- Database: dbpetroleum
-- Owner: postgres
-- Password: admin123

DROP DATABASE IF EXISTS dbpetroleum;

CREATE DATABASE dbpetroleum
	WITH OWNER = postgres
		ENCODING = 'UTF8'
		TABLESPACE = pg_default
		LC_COLLATE = 'English_United States.1252'
		LC_CTYPE = 'English_United States.1252'
	CONNECTION LIMIT = -1;