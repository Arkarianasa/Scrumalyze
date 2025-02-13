-- ScrumRole Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO ScrumRole (RoleName, RoleDescription) VALUES ('Scrum Master', 'Facilitates the Scrum process.');
DECLARE @ScrumMasterID INT = SCOPE_IDENTITY();

INSERT INTO ScrumRole (RoleName, RoleDescription) VALUES ('Product Owner', 'Responsible for defining the product vision.');
DECLARE @ProductOwnerID INT = SCOPE_IDENTITY();

INSERT INTO ScrumRole (RoleName, RoleDescription) VALUES ('Developer', 'Works on product development.');
DECLARE @DeveloperID INT = SCOPE_IDENTITY();

INSERT INTO ScrumRole (RoleName, RoleDescription) VALUES ('Stakeholder', 'Interested in the product and is outside of SCRUM team.');
DECLARE @StakeholderID INT = SCOPE_IDENTITY();

-- WorkItemType Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO WorkItemType (TypeName) VALUES ('User Story');
INSERT INTO WorkItemType (TypeName) VALUES ('Task');
INSERT INTO WorkItemType (TypeName) VALUES ('Bug');
INSERT INTO WorkItemType (TypeName) VALUES ('Spike');

-- Prioratization
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Numerical Ranking
INSERT INTO PrioritizationScheme (SchemeName)
VALUES ('Numerical Ranking');

DECLARE @NumericalSchemeID INT = SCOPE_IDENTITY();

-- Common Priority Levels
INSERT INTO PrioritizationScheme (SchemeName)
VALUES ('Common Priority Levels');

DECLARE @CommonSchemeID INT = SCOPE_IDENTITY();

INSERT INTO PrioritizationLevel (PrioritizationSchemeID, LevelName, LevelValue)
VALUES 
(@CommonSchemeID, 'Low', 3),
(@CommonSchemeID, 'Medium', 2),
(@CommonSchemeID, 'High', 1);

-- MoSCoW Method
INSERT INTO PrioritizationScheme (SchemeName)
VALUES ('MoSCoW Method');

DECLARE @MoSCoWSchemeID INT = SCOPE_IDENTITY();

INSERT INTO PrioritizationLevel (PrioritizationSchemeID, LevelName, LevelValue)
VALUES 
(@MoSCoWSchemeID, 'Must have', 1),
(@MoSCoWSchemeID, 'Should have', 2),
(@MoSCoWSchemeID, 'Could have', 3),
(@MoSCoWSchemeID, 'Won''t have', 4);

-- Business Value Scoring
INSERT INTO PrioritizationScheme (SchemeName)
VALUES ('Business Value Scoring');

DECLARE @BusinessValueSchemeID INT = SCOPE_IDENTITY();

INSERT INTO PrioritizationLevel (PrioritizationSchemeID, LevelName, LevelValue)
VALUES 
(@BusinessValueSchemeID, 'Low Value', 3),
(@BusinessValueSchemeID, 'Medium Value', 2),
(@BusinessValueSchemeID, 'High Value', 1);

-- RICE Scoring
INSERT INTO PrioritizationScheme (SchemeName)
VALUES ('RICE Scoring');

DECLARE @RiceSchemeID INT = SCOPE_IDENTITY();

INSERT INTO PrioritizationLevel (PrioritizationSchemeID, LevelName, LevelValue)
VALUES 
(@RiceSchemeID, 'Low Impact', 4),
(@RiceSchemeID, 'Moderate Impact', 3),
(@RiceSchemeID, 'Significant Impact', 2),
(@RiceSchemeID, 'Critical Impact', 1);

-- ScrumTeam Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO ScrumTeam (TeamName, WorkDayHours) VALUES ('Atomic', 8);
DECLARE @AtomicTeamID INT = SCOPE_IDENTITY();

INSERT INTO ScrumTeam (TeamName, WorkDayHours) VALUES ('Bionic', 8);
DECLARE @BionicTeamID INT = SCOPE_IDENTITY();

INSERT INTO ScrumTeam (TeamName, WorkDayHours) VALUES ('Cosmic', 8);
DECLARE @CosmicTeamID INT = SCOPE_IDENTITY();

-- Person Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Atomic
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@AtomicTeamID, @ScrumMasterID, 'Eve', 'Clark', 1); -- ID 1
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@AtomicTeamID, @ProductOwnerID, 'Frank', 'Williams', 1);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@AtomicTeamID, @DeveloperID, 'Grace', 'Hall', 1);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@AtomicTeamID, @DeveloperID, 'Uma', 'King', 1);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@AtomicTeamID, @DeveloperID, 'Victor', 'Hill', 1);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@AtomicTeamID, @DeveloperID, 'Wendy', 'Scott', 1);

-- Team Bionic
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@BionicTeamID, @ScrumMasterID, 'Isabella', 'Davis', 1); -- ID 7
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@BionicTeamID, @ProductOwnerID, 'Jack', 'Miller', 1);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@BionicTeamID, @DeveloperID, 'Leo', 'Garcia', 1);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@BionicTeamID, @DeveloperID, 'Kate', 'Wilson', 1);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@BionicTeamID, @DeveloperID, 'Sam', 'Walker', 1);

-- Team Cosmic
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@CosmicTeamID, @ScrumMasterID, 'Maya', 'Martinez', 1); -- ID 12
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@CosmicTeamID, @ProductOwnerID, 'Noah', 'Brown', 1);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@CosmicTeamID, @DeveloperID, 'Olivia', 'Lopez', 1);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@CosmicTeamID, @DeveloperID, 'Quinn', 'Martinez', 1);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@CosmicTeamID, @DeveloperID, 'Rachel', 'Lewis', 1);

-- Stakeholders
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@AtomicTeamID, @StakeholderID, 'Yara', 'Nelson', 0); -- ID 17
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@BionicTeamID, @StakeholderID, 'Zane', 'Carter', 0);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@CosmicTeamID, @StakeholderID, 'Henry', 'Moore', 0);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@AtomicTeamID, @StakeholderID, 'Xander', 'Adams', 0);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@BionicTeamID, @StakeholderID, 'Tina', 'Young', 0);
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName, IsScrumTeamMember) VALUES (@CosmicTeamID, @StakeholderID, 'Paul', 'Gonzalez', 0);

-- Timebox Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@AtomicTeamID, 80, 'Sprint'); -- 2 weeks

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@AtomicTeamID, 2, 'Sprint Planning');
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@AtomicTeamID, 0.25, 'Daily Standup'); -- 15 minutes
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@AtomicTeamID, 2, 'Sprint Review');
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@AtomicTeamID, 1, 'Sprint Retrospective');

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@AtomicTeamID, 16, 'Spike'); -- 2 days
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@AtomicTeamID, 24, 'Task'); -- 3 days

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@BionicTeamID, 80, 'Sprint'); -- 2 weeks

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@BionicTeamID, 2, 'Sprint Planning');
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@BionicTeamID, 0.25, 'Daily Standup'); -- 15 minutes
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@BionicTeamID, 2, 'Sprint Review');
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@BionicTeamID, 1, 'Sprint Retrospective');

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@BionicTeamID, 16, 'Spike'); -- 2 days
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@BionicTeamID, 24, 'Task'); -- 3 days

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@CosmicTeamID, 80, 'Sprint'); -- 2 weeks

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@CosmicTeamID, 2, 'Sprint Planning');
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@CosmicTeamID, 0.25, 'Daily Standup'); -- 15 minutes
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@CosmicTeamID, 2, 'Sprint Review');
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@CosmicTeamID, 1, 'Sprint Retrospective');

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@CosmicTeamID, 16, 'Spike'); -- 2 days
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (@CosmicTeamID, 24, 'Task'); -- 3 days

-- AcceptanceCriteria Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (@AtomicTeamID, 'Example 1');
INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (@AtomicTeamID, 'Example 2');
INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (@AtomicTeamID, 'Example 3');

INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (@BionicTeamID, 'Example 1');
INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (@BionicTeamID, 'Example 2');
INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (@BionicTeamID, 'Example 3');

INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (@CosmicTeamID, 'Example 1');
INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (@CosmicTeamID, 'Example 2');
INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (@CosmicTeamID, 'Example 3');

-- DefinitionOfDone Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO DefinitionOfDone (ScrumTeamID, ConstraintDescription, IsCompanyPolicy) VALUES (@AtomicTeamID, 'All tests must pass', 1);
INSERT INTO DefinitionOfDone (ScrumTeamID, ConstraintDescription, IsCompanyPolicy) VALUES (@AtomicTeamID, 'Code reviewed by another developer', 1);
INSERT INTO DefinitionOfDone (ScrumTeamID, ConstraintDescription, IsCompanyPolicy) VALUES (@AtomicTeamID, 'Acceptance Criteria must be met', 0);

INSERT INTO DefinitionOfDone (ScrumTeamID, ConstraintDescription, IsCompanyPolicy) VALUES (@BionicTeamID, 'All tests must pass', 1);
INSERT INTO DefinitionOfDone (ScrumTeamID, ConstraintDescription, IsCompanyPolicy) VALUES (@BionicTeamID, 'Code reviewed by another developer', 1);
INSERT INTO DefinitionOfDone (ScrumTeamID, ConstraintDescription, IsCompanyPolicy) VALUES (@BionicTeamID, 'Acceptance Criteria must be met', 1);

INSERT INTO DefinitionOfDone (ScrumTeamID, ConstraintDescription, IsCompanyPolicy) VALUES (@CosmicTeamID, 'All tests must pass', 1);
INSERT INTO DefinitionOfDone (ScrumTeamID, ConstraintDescription, IsCompanyPolicy) VALUES (@CosmicTeamID, 'Code reviewed by another developer', 1);
INSERT INTO DefinitionOfDone (ScrumTeamID, ConstraintDescription, IsCompanyPolicy) VALUES (@CosmicTeamID, 'Acceptance Criteria must be met', 1);

-- SprintGoal Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO SprintGoal (Description, ResponsiblePersonID) VALUES ('Improve user authentication process', 1); -- ID 1
INSERT INTO SprintGoal (Description) VALUES ('Implement new character design');
INSERT INTO SprintGoal (Description) VALUES ('Develop new reservation system');

INSERT INTO SprintGoal (Description, ResponsiblePersonID) VALUES ('Create user settings', 1); -- ID 4
INSERT INTO SprintGoal (Description) VALUES ('Implement new scoring system');
INSERT INTO SprintGoal (Description) VALUES ('Improve selection of movie screenings');

-- ProductGoal Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO ProductGoal (ScrumTeamID, Description) VALUES (@AtomicTeamID, 'Create banking application');
INSERT INTO ProductGoal (ScrumTeamID, Description, ResponsiblePersonID) VALUES (@BionicTeamID, 'Launch mobile game', 8);
INSERT INTO ProductGoal (ScrumTeamID, Description, ResponsiblePersonID) VALUES (@CosmicTeamID, 'Develop new cinema web application', 14);

-- Sprint Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO Sprint (ScrumTeamID, SprintGoalID, ProductGoalID, StartDate, EndDate, TimeboxID) VALUES (@AtomicTeamID, 1, 1, '2024-09-15', '2024-09-30', 1);
INSERT INTO Sprint (ScrumTeamID, SprintGoalID, ProductGoalID, StartDate, EndDate) VALUES (@AtomicTeamID, 4, 1, '2024-10-01', NULL);

INSERT INTO Sprint (ScrumTeamID, SprintGoalID, ProductGoalID, StartDate, EndDate, TimeboxID) VALUES (@BionicTeamID, 2, 2, '2024-09-17', '2024-09-30', 1);
INSERT INTO Sprint (ScrumTeamID, SprintGoalID, ProductGoalID, StartDate, EndDate, TimeboxID) VALUES (@BionicTeamID, 5, 2, '2024-10-01', NULL, 1);

INSERT INTO Sprint (ScrumTeamID, SprintGoalID, ProductGoalID, StartDate, EndDate, TimeboxID) VALUES (@CosmicTeamID, 3, 3, '2024-09-17', '2024-09-30', 1);
INSERT INTO Sprint (ScrumTeamID, SprintGoalID, ProductGoalID, StartDate, EndDate, TimeboxID) VALUES (@CosmicTeamID, 6, 3, '2024-10-01', NULL, 1);

-- Increment Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO Increment (ScrumTeamID, SprintID, ProductGoalID, Description) VALUES (@AtomicTeamID, 1, 1, 'User authentication module completed');
INSERT INTO Increment (ScrumTeamID, SprintID, ProductGoalID, Description) VALUES (@AtomicTeamID, 1, NULL, 'Amazing very usefull feature implemented.');
INSERT INTO Increment (ScrumTeamID, SprintID, ProductGoalID, Description) VALUES (@BionicTeamID, 3, 2, 'Cooler character design completed');
INSERT INTO Increment (ScrumTeamID, SprintID, ProductGoalID, Description) VALUES (@CosmicTeamID, 5, 3, 'New reservation system implemented');

-- ProductBacklog
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO ProductBacklog (ScrumTeamID, ProductGoalID, PrimaryPrioritizationSchemeID) VALUES (@AtomicTeamID, 1, @NumericalSchemeID);
INSERT INTO ProductBacklog (ScrumTeamID, ProductGoalID, ResponsiblePersonID, PrimaryPrioritizationSchemeID) VALUES (@BionicTeamID, 2, 8, @CommonSchemeID);
INSERT INTO ProductBacklog (ScrumTeamID, ProductGoalID, ResponsiblePersonID, PrimaryPrioritizationSchemeID, SecondaryPrioritizationSchemeID) VALUES (@CosmicTeamID, 3, 14, @MoSCoWSchemeID, @BusinessValueSchemeID);

-- SprintBacklog
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO SprintBacklog (SprintID, ResponsiblePersonID) VALUES (1, 1);
INSERT INTO SprintBacklog (SprintID) VALUES (4);

INSERT INTO SprintBacklog (SprintID) VALUES (2);
INSERT INTO SprintBacklog (SprintID) VALUES (5);

INSERT INTO SprintBacklog (SprintID) VALUES (3);
INSERT INTO SprintBacklog (SprintID) VALUES (6);

-- BacklogItem Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Backlog Items for Team Atomic
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done) VALUES ('Refactor Login', 'Refactor login system', 1, 1, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done) VALUES ('2FA Implementation', 'Implement 2-factor authentication', 1, 1, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, PrimaryPriorityValue) VALUES ('Optimize Recovery', 'Optimize password recovery process', 1, 1, 1, 3);

INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, PrimaryPriorityValue) VALUES ('User Settings UI', 'Create UI for user settings', 1, 4, 0, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, PrimaryPriorityValue) VALUES ('User Settings Backend', 'Backend for user settings', 1, 4, 0, 2);

-- Backlog Items for Team Bionic
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, PrimaryPriorityValue) VALUES ('Hero Design', 'Design new hero character', 2, 2, 1, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, PrimaryPriorityValue) VALUES ('Character Animations', 'Develop animations for character', 2, 2, 1, 2);

INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, PrimaryPriorityValue) VALUES ('Scoring Algorithm', 'Develop scoring algorithm', 2, 5, 0, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, PrimaryPriorityValue) VALUES ('Score Persistence', 'Implement score persistence', 2, 5, 0, 2);

-- Backlog Items for Team Cosmic
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, PrimaryPriorityValue, SecondaryPriorityValue) VALUES ('Reservation DB', 'Create database schema for reservation', 3, 3, 1, 1, 2);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, PrimaryPriorityValue, SecondaryPriorityValue) VALUES ('Reservation UI', 'Build reservation UI', 3, 3, 1, 2, 1);

INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, PrimaryPriorityValue, SecondaryPriorityValue) VALUES ('Movie Filtering', 'Improve movie selection filtering', 3, 6, 0, 1, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, PrimaryPriorityValue, SecondaryPriorityValue) VALUES ('Recommendation Engine', 'Add recommendation engine', 3, 6, 0, 1, 2);

-- WorkItem Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Work Items for Backlog Items of SprintGoal 1 Team Atomic
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (1, '2024-09-23', 1, 1, 'Refactor login system');
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (2, NULL, 1, 1, 'Implement 2-factor authentication');
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (3, NULL, 1, 2, 'Optimize password recovery process');

-- Work Items for Backlog Items of SprintGoal 2 Team Bionic
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (4, NULL, 2, 1, 'Create UI for user settings');
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (5, NULL, 2, 1, 'Backend for user settings');

-- Work Items for Backlog Items of SprintGoal 3 Team Cosmic
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (6, NULL, 3, 2, 'Design new hero character');
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (7, NULL, 3, 1, 'Develop animations for character');

-- Work Items for Backlog Items of SprintGoal 4 Team Atomic
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (8, NULL, NULL, 1, 'Develop scoring algorithm');
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (9, NULL, NULL, 2, 'Implement score persistence');

-- Work Items for Backlog Items of SprintGoal 5 Team Bionic
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (10, NULL, NULL, 1, 'Create database schema for reservation');
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (11, NULL, NULL, 2, 'Build reservation UI');

-- Work Items for Backlog Items of SprintGoal 6 Team Cosmic
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (12, NULL, NULL, 2, 'Improve movie selection filtering');
INSERT INTO WorkItem (BacklogItemID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (13, NULL, NULL, 1, 'Add recommendation engine');

-- PersonWorkItem Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Atomic
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (3, 1); -- Grace works on WorkItem 1
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (4, 1); -- Uma works on WorkItem 1
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (5, 2); -- Victor works on WorkItem 2
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (6, 3); -- Wendy works on WorkItem 3
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (4, 4); -- Uma works on WorkItem 4
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (6, 5); -- Wendy works on WorkItem 5
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (2, 5); -- Product Owner on WorkItem 5

-- Team Bionic
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (9, 6);  -- Leo works on WorkItem 6
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (10, 6); -- Kate works on WorkItem 6
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (11, 7); -- Sam works on WorkItem 7
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (9, 8); -- Leo works on WorkItem 8
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (11, 9); -- Sam works on WorkItem 9

-- Team Cosmic
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (14, 10);  -- Olivia works on WorkItem 10
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (15, 11);  -- Quinn works on WorkItem 11
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (16, 12);  -- Rachel works on WorkItem 12
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (14, 13); -- Olivia works on WorkItem 13
INSERT INTO WorkItem_Person (PersonID, WorkItemID) VALUES (16, 13); -- Rachel works on WorkItem 13

-- Map WorkItems to DefinitionOfDone and AcceptanceCriteria
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Atomic
INSERT INTO WorkItem_DefinitionOfDone (WorkItemID, DefinitionOfDoneID)
VALUES 
    (1, 1),
	(1, 2),
    (1, 3),
	(2, 1),
    (2, 2),
	(2, 3),
	(3, 1),
    (3, 2),
	(3, 3),
	(8, 1),
    (8, 2),
	(8, 3),
	(9, 1),
    (9, 2),
	(9, 3);

-- Team Bionic
INSERT INTO WorkItem_DefinitionOfDone (WorkItemID, DefinitionOfDoneID)
VALUES 
    (4, 4),
	(4, 5),
    (4, 6),
	(5, 4),
    (5, 5),
	(5, 6),
	(10, 4),
    (10, 5),
	(10, 6),
	(11, 4),
    (11, 5),
	(11, 6);

-- Team Cosmic
INSERT INTO WorkItem_DefinitionOfDone (WorkItemID, DefinitionOfDoneID)
VALUES 
    (6, 7),
	(6, 8),
    (6, 9),
    (7, 7),
	(7, 8),
    (7, 9),
    (12, 7),
	(12, 8),
    (12, 9),
    (13, 7),
	(13, 8),
    (13, 9);

INSERT INTO WorkItem_AcceptanceCriteria (WorkItemID, AcceptanceCriteriaID)
VALUES 
    (1, 1),
    (2, 2),
    (3, 3),
    (8, 1),
    (9, 2),

    (4, 4),
    (5, 5),
	(10, 6),
    (11, 4),

    (6, 7),
    (7, 8),
	(12, 9),
    (13, 7);

-- ProcessStep Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Atomic: Scrum Events for Sprint 1

-- Sprint Planning
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID) 
VALUES (1, 'Sprint Planning', '2024-09-15 09:00:00', '2024-09-15 11:00:00', 2, 2); -- Eve Clark

-- Daily Standups
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID) 
VALUES (1, 'Daily Standup', '2024-09-16 09:00:00', '2024-09-16 09:15:00', 3, NULL),
       (1, 'Daily Standup', '2024-09-17 09:00:00', '2024-09-17 09:25:00', 3, NULL),
       (1, 'Daily Standup', '2024-09-18 09:00:00', '2024-09-18 09:35:00', 3, NULL),
       (1, 'Daily Standup', '2024-09-19 09:00:00', '2024-09-19 09:25:00', 3, NULL),
       (1, 'Daily Standup', '2024-09-20 09:00:00', '2024-09-20 09:15:00', 3, NULL),
       (1, 'Daily Standup', '2024-09-21 09:00:00', '2024-09-21 09:18:00', 3, NULL),
       (1, 'Daily Standup', '2024-09-22 09:00:00', '2024-09-22 09:15:00', 3, NULL);

-- Sprint Review
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID) 
VALUES (1, 'Sprint Review', '2024-09-30 14:00:00', '2024-09-30 16:00:00', 4, 1); -- Eve Clark

-- Sprint Retrospective
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID) 
VALUES (1, 'Sprint Retrospective', '2024-09-30 16:00:00', '2024-09-30 18:00:00', 5, 1); -- Eve Clark

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Atomic: Scrum Events for Sprint 4

-- Sprint Planning
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID) 
VALUES (4, 'Sprint Planning', '2024-10-01 09:00:00', '2024-10-01 11:00:00', 2, 1); -- Eve Clark

-- Daily Standups
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID) 
VALUES (4, 'Daily Standup', '2024-10-02 09:00:00', '2024-10-02 09:15:00', 3, NULL),
       (4, 'Daily Standup', '2024-10-03 09:00:00', '2024-10-03 09:15:00', 3, NULL),
       (4, 'Daily Standup', '2024-10-04 09:00:00', '2024-10-04 09:15:00', 3, NULL);

-- Sprint Review
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID) 
VALUES (4, 'Sprint Review', '2024-10-14 14:00:00', '2024-10-14 17:00:00', 4, 1); -- Eve Clark

-- Sprint Retrospective
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (4, 'Sprint Retrospective', '2024-10-14 16:00:00', '2024-10-14 17:00:00', 5, 1); -- Eve Clark

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Bionic: Scrum Events for Sprint 2

-- Sprint Planning
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (2, 'Sprint Planning', '2024-09-15 09:00:00', '2024-09-15 11:35:00', 2, 7); -- Isabella Davis

-- Daily Standups
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (2, 'Daily Standup', '2024-09-16 09:00:00', '2024-09-16 09:15:00', 3, NULL),
       (2, 'Daily Standup', '2024-09-17 09:00:00', '2024-09-17 09:15:00', 3, NULL),
       (2, 'Daily Standup', '2024-09-18 09:00:00', '2024-09-18 09:15:00', 3, NULL),
       (2, 'Daily Standup', '2024-09-19 09:00:00', '2024-09-19 09:15:00', 3, NULL),
       (2, 'Daily Standup', '2024-09-20 09:00:00', '2024-09-20 09:15:00', 3, NULL),
       (2, 'Daily Standup', '2024-09-21 09:00:00', '2024-09-21 09:15:00', 3, NULL),
       (2, 'Daily Standup', '2024-09-22 09:00:00', '2024-09-22 09:15:00', 3, NULL);

-- Sprint Review
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (2, 'Sprint Review', '2024-09-30 14:00:00', '2024-09-30 16:00:00', 4, 7); -- Isabella Davis

-- Sprint Retrospective
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (2, 'Sprint Retrospective', '2024-09-30 16:00:00', '2024-09-30 17:30:00', 5, 7); -- Isabella Davis

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Bionic: Scrum Events for Sprint 5

-- Sprint Planning
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID) 
VALUES (5, 'Sprint Planning', '2024-10-01 09:00:00', '2024-10-01 11:00:00', 2, 7); -- Isabella Davis

-- Daily Standups
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (5, 'Daily Standup', '2024-10-02 09:00:00', '2024-10-02 09:15:00', 3, NULL),
       (5, 'Daily Standup', '2024-10-03 09:00:00', '2024-10-03 09:15:00', 3, NULL),
       (5, 'Daily Standup', '2024-10-04 09:00:00', '2024-10-04 09:15:00', 3, NULL);

-- Sprint Review
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (5, 'Sprint Review', '2024-10-14 14:00:00', '2024-10-14 16:00:00', 4, 7); -- Isabella Davis

-- Sprint Retrospective
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (5, 'Sprint Retrospective', '2024-10-14 16:00:00', '2024-10-14 17:00:00', 5, 7); -- Isabella Davis

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Cosmic: Scrum Events for Sprint 3

-- Sprint Planning
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, GuidedByPersonID) 
VALUES (3, 'Sprint Planning', '2024-09-15 09:00:00', '2024-09-15 11:00:00', 10); -- John Smith

-- Daily Standups
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID) 
VALUES (3, 'Daily Standup', '2024-09-16 09:00:00', '2024-09-16 09:15:00', 3, NULL),
       (3, 'Daily Standup', '2024-09-17 09:00:00', '2024-09-17 09:15:00', 3, NULL),
       (3, 'Daily Standup', '2024-09-18 09:00:00', '2024-09-18 09:15:00', 3, NULL),
       (3, 'Daily Standup', '2024-09-19 09:00:00', '2024-09-19 09:15:00', 3, NULL),
       (3, 'Daily Standup', '2024-09-20 09:00:00', '2024-09-20 09:15:00', 3, NULL),
       (3, 'Daily Standup', '2024-09-21 09:00:00', '2024-09-21 09:15:00', 3, NULL),
       (3, 'Daily Standup', '2024-09-22 09:00:00', '2024-09-22 09:15:00', 3, NULL);

-- Sprint Review
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (3, 'Sprint Review', '2024-09-30 14:00:00', '2024-09-30 16:00:00', 4, 10); -- John Smith

-- Sprint Retrospective
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (3, 'Sprint Retrospective', '2024-09-30 16:00:00', '2024-09-30 17:00:00', 5, 10); -- John Smith

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Cosmic: Scrum Events for Sprint 6

-- Sprint Planning
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (6, 'Sprint Planning', '2024-10-01 09:00:00', '2024-10-01 11:00:00', 2, 10); -- John Smith

-- Daily Standups
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (6, 'Daily Standup', '2024-10-02 09:00:00', '2024-10-02 09:15:00', 3, NULL),
       (6, 'Daily Standup', '2024-10-03 09:00:00', '2024-10-03 09:15:00', 3, NULL),
       (6, 'Daily Standup', '2024-10-04 09:00:00', '2024-10-04 09:15:00', 3, NULL);

-- Sprint Review
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (6, 'Sprint Review', '2024-10-14 14:00:00', '2024-10-14 16:00:00', 4, 10); -- John Smith

-- Sprint Retrospective
INSERT INTO ProcessStep (SprintID, ProcessStepName, StartDate, EndDate, TimeboxID, GuidedByPersonID)  
VALUES (6, 'Sprint Retrospective', '2024-10-14 16:00:00', '2024-10-14 17:00:00', 5, 10); -- John Smith



-- Communication Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Atomic: Communication Data
-- Stakeholder Meeting Communication
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (1, 17, 'Discussed project goals and progress.'); -- Eve to Yara
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (1, 18, 'Provided updates on user authentication feature.'); -- Eve to Zane

-- Developer Consultation Communication
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (1, 3, 'Asked for feedback on authentication code.'); -- Eve to Grace
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (3, 1, 'Provided suggestions on improving code quality.'); -- Grace to Eve

-- Team Sync Communication
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (2, 1, 'Reviewed tasks and timelines during sync.'); -- Frank to Eve
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (2, 3, 'Collaborated on defining next steps for the sprint.'); -- Frank to Grace

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Bionic: Communication Data
-- Developer Consultation Communication
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (9, 8, 'Consulted on UI design choices.'); -- Leo to Jack
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (9, 10, 'Sought advice on database queries.'); -- Leo to Kate

-- Team Sync Communication
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (7, 9, 'Reviewed sprint backlog during the sync.'); -- Isabella to Leo
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (10, 9, 'Clarified task priorities for the week.'); -- Kate to Leo

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Cosmic: Communication Data
-- Stakeholder Meeting Communication
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (12, 19, 'Discussed feedback on the web application.'); -- Maya to Henry
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (14, 19, 'Discussed feedback on the web application.'); -- Olivia to Henry
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (12, 19, 'Reviewed project timelines and expectations.'); -- Maya to Henry

-- Developer Consultation Communication
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (14, 13, 'Requested insights on performance issues.'); -- Quinn to Olivia
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (14, 15, 'Shared ideas on code optimization.'); -- Quinn to Rachel

-- Team Sync Communication
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (12, 14, 'Coordinated on testing strategies.'); -- Maya to Quinn
INSERT INTO Communication (SourcePersonID, TargetPersonID, CommunicationDescription)
VALUES (12, 15, 'Discussed workload and deadlines.'); -- Maya to Rachel
