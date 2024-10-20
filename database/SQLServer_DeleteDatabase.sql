DECLARE @sql NVARCHAR(MAX) = N'';

-- Generate a script to drop all foreign keys
SELECT @sql += 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) +
               ' DROP CONSTRAINT ' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.foreign_keys;

-- Execute the script
EXEC sp_executesql @sql;

-- Drop tables in the correct order
DROP TABLE IF EXISTS Communication;
DROP TABLE IF EXISTS PersonWorkItem;
DROP TABLE IF EXISTS WorkItem;
DROP TABLE IF EXISTS WorkItemType;
DROP TABLE IF EXISTS ProcessStep;
DROP TABLE IF EXISTS BacklogItem;
DROP TABLE IF EXISTS SprintBacklog;
DROP TABLE IF EXISTS ProductBacklog;
DROP TABLE IF EXISTS Increment;
DROP TABLE IF EXISTS Sprint;
DROP TABLE IF EXISTS ProductGoal;
DROP TABLE IF EXISTS SprintGoal;
DROP TABLE IF EXISTS Person;
DROP TABLE IF EXISTS ScrumRole;
DROP TABLE IF EXISTS ScrumTeam;
DROP TABLE IF EXISTS DefinitionOfDone;
DROP TABLE IF EXISTS AcceptanceCriteria;
DROP TABLE IF EXISTS Timebox;
