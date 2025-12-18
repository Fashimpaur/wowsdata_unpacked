--
-- Project-specific DB bootstrap
-- - Ensures dedicated schema `gamedata`
-- - Sets database and role search_path to `gamedata, public`
-- - Script is idempotent and safe to re-run

-- 1) Create dedicated schema for application objects (owned by current user)
CREATE SCHEMA IF NOT EXISTS gamedata;

-- 2) Set database-level default search_path to prefer `gamedata`
--    Use psql to execute dynamic ALTER DATABASE against the current DB
SELECT format('ALTER DATABASE %I SET search_path TO gamedata, public', current_database()) \gexec

-- 3) Also set role-level search_path for the current user in this database
SELECT format('ALTER ROLE %I IN DATABASE %I SET search_path TO gamedata, public', current_user, current_database()) \gexec

-- 4) (Optional hardening) Prevent arbitrary object creation in `public` by non-privileged roles
    REVOKE
CREATE
ON SCHEMA public FROM PUBLIC;

-- 5) Ensure current user has usage/create on the `gamedata` schema (harmless if already owner)
GRANT USAGE, CREATE
ON SCHEMA gamedata TO CURRENT_USER;

-- 6) Default privileges so that objects created in `gamedata` are accessible to the owner by default
ALTER
DEFAULT PRIVILEGES IN SCHEMA gamedata GRANT
SELECT,
INSERT
,
UPDATE,
DELETE
ON TABLES TO CURRENT_USER;
ALTER
DEFAULT PRIVILEGES IN SCHEMA gamedata GRANT USAGE ON SEQUENCES TO CURRENT_USER;
