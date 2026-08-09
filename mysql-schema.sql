-- MySQL schema for the Sandai League web app
-- Run with: mysql -u root -p < mysql-schema.sql

CREATE DATABASE IF NOT EXISTS sandai_league
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE sandai_league;

-- Players and authentication data
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Team data used for standings, team pages, and match assignments
CREATE TABLE teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  short_name VARCHAR(40) NOT NULL,
  logo VARCHAR(255),
  status ENUM('Active','Inactive','Pending','Eliminated','On Hold') NOT NULL DEFAULT 'Active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_team_name (name)
) ENGINE=InnoDB;

-- Match schedule and results
CREATE TABLE matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_a_id INT NOT NULL,
  team_b_id INT NOT NULL,
  date DATE NOT NULL,
  time TIME DEFAULT '00:00:00',
  venue VARCHAR(200) DEFAULT NULL,
  status ENUM('upcoming','live','completed') NOT NULL DEFAULT 'upcoming',
  score_a TINYINT UNSIGNED DEFAULT NULL,
  score_b TINYINT UNSIGNED DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_matches_team_a FOREIGN KEY (team_a_id) REFERENCES teams(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_matches_team_b FOREIGN KEY (team_b_id) REFERENCES teams(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_matches_status (status),
  INDEX idx_matches_date (date)
) ENGINE=InnoDB;

-- League announcements and tournament notices
CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(80) DEFAULT 'General',
  date DATE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_announcements_date (date)
) ENGINE=InnoDB;

-- Optional tournament metadata table if you want to store league settings
CREATE TABLE tournament_settings (
  id INT PRIMARY KEY,
  tournament_name VARCHAR(180) NOT NULL DEFAULT 'Sandai League',
  tagline VARCHAR(255) DEFAULT NULL,
  status VARCHAR(80) DEFAULT NULL,
  venue VARCHAR(180) DEFAULT NULL,
  organizer VARCHAR(180) DEFAULT NULL,
  contact_email VARCHAR(180) DEFAULT NULL,
  contact_phone VARCHAR(80) DEFAULT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO tournament_settings (id, tournament_name, tagline, status, venue, organizer, contact_email, contact_phone)
VALUES (1, 'Sandai League', 'A premium college tournament platform built for dynamic league action.', 'In Progress', 'North Campus Arena', 'Student Sports Council', 'tournament@sdai.edu', '+1 (555) 014-2210')
ON DUPLICATE KEY UPDATE
  tagline=VALUES(tagline),
  status=VALUES(status),
  venue=VALUES(venue),
  organizer=VALUES(organizer),
  contact_email=VALUES(contact_email),
  contact_phone=VALUES(contact_phone);
