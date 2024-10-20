-- ScrumTeam Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO ScrumTeam (TeamName) VALUES ('Atomic');
INSERT INTO ScrumTeam (TeamName) VALUES ('Bionic');
INSERT INTO ScrumTeam (TeamName) VALUES ('Cosmic');

-- ScrumRole Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO ScrumRole (RoleName, RoleDescription) VALUES ('Scrum Master', 'Facilitates the Scrum process.');
INSERT INTO ScrumRole (RoleName, RoleDescription) VALUES ('Product Owner', 'Responsible for defining the product vision.');
INSERT INTO ScrumRole (RoleName, RoleDescription) VALUES ('Developer', 'Works on product development.');
INSERT INTO ScrumRole (RoleName, RoleDescription) VALUES ('Stakeholder', 'Interested in the product and is outside of SCRUM team.');

-- Person Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Atomic
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (1, 1, 'Eve', 'Clark'); -- ID 1
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (1, 2, 'Frank', 'Williams');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (1, 3, 'Grace', 'Hall');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (1, 3, 'Uma', 'King');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (1, 3, 'Victor', 'Hill');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (1, 3, 'Wendy', 'Scott');

-- Team Bionic
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (2, 1, 'Isabella', 'Davis'); -- ID 7
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (2, 2, 'Jack', 'Miller');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (2, 3, 'Leo', 'Garcia');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (2, 3, 'Kate', 'Wilson');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (2, 3, 'Sam', 'Walker');

-- Team Cosmic
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (3, 1, 'Maya', 'Martinez'); -- ID 12
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (3, 2, 'Noah', 'Brown');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (3, 3, 'Olivia', 'Lopez');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (3, 3, 'Quinn', 'Martinez');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (3, 3, 'Rachel', 'Lewis');

-- Stakeholders
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (1, 4, 'Yara', 'Nelson'); -- ID 17
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (2, 4, 'Zane', 'Carter');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (3, 4, 'Henry', 'Moore');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (1, 4, 'Xander', 'Adams');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (2, 4, 'Tina', 'Young');
INSERT INTO Person (ScrumTeamID, RoleID, FirstName, LastName) VALUES (3, 4, 'Paul', 'Gonzalez');

-- Timebox Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (1, 336, 'Sprint'); -- 2 weeks

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (1, 2, 'Sprint Planning');
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (1, 0.25, 'Daily Standup'); -- 15 minutes
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (1, 2, 'Sprint Review');
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (1, 1, 'Sprint Retrospective');

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (1, 48, 'Spike'); -- 2 days
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (1, 72, 'Task'); -- 3 days

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (2, 336, 'Sprint'); -- 2 weeks

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (2, 2, 'Sprint Planning');
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (2, 0.25, 'Daily Standup'); -- 15 minutes
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (2, 2, 'Sprint Review');
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (2, 1, 'Sprint Retrospective');

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (2, 48, 'Spike'); -- 2 days
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (2, 72, 'Task'); -- 3 days

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (3, 336, 'Sprint'); -- 2 weeks

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (3, 2, 'Sprint Planning');
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (3, 0.25, 'Daily Standup'); -- 15 minutes
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (3, 2, 'Sprint Review');
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (3, 1, 'Sprint Retrospective');

INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (3, 48, 'Spike'); -- 2 days
INSERT INTO Timebox (ScrumTeamID, Duration, TimeboxDescription) VALUES (3, 72, 'Task'); -- 3 days

-- AcceptanceCriteria Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (1, 'Feature must be implemented');
INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (1, 'Bug must be removed');

INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (2, 'Feature must be implemented');
INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (2, 'Bug must be removed');

INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (3, 'Feature must be implemented');
INSERT INTO AcceptanceCriteria (ScrumTeamID, ConstraintDescription) VALUES (3, 'Bug must be removed');

-- DefinitionOfDone Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO DefinitionOfDone (ScrumTeamID, ConstraintDescription) VALUES (1, 'All tests must pass; Code reviewed by another developer; Acceptance Criteria must be met');
INSERT INTO DefinitionOfDone (ScrumTeamID, ConstraintDescription) VALUES (2, 'All tests must pass; Code reviewed by another developer; Acceptance Criteria must be met');
INSERT INTO DefinitionOfDone (ScrumTeamID, ConstraintDescription) VALUES (3, 'All tests must pass; Code reviewed by another developer; Acceptance Criteria must be met');

-- SprintGoal Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO SprintGoal (Description, CreatedByPersonID) VALUES ('Improve user authentication process', 1); -- ID 1
INSERT INTO SprintGoal (Description, CreatedByPersonID) VALUES ('Implement new character design', 7);
INSERT INTO SprintGoal (Description, CreatedByPersonID) VALUES ('Develop new reservation system', 12);

INSERT INTO SprintGoal (Description, CreatedByPersonID) VALUES ('Create user settings', 1); -- ID 4
INSERT INTO SprintGoal (Description, CreatedByPersonID) VALUES ('Implement new scoring system', 7);
INSERT INTO SprintGoal (Description, CreatedByPersonID) VALUES ('Improve selection of movie screenings', 12);

-- ProductGoal Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO ProductGoal (ScrumTeamID, Description, CreatedByPersonID) VALUES (1, 'Create banking application', 2);
INSERT INTO ProductGoal (ScrumTeamID, Description, CreatedByPersonID) VALUES (2, 'Launch mobile game', 8);
INSERT INTO ProductGoal (ScrumTeamID, Description, CreatedByPersonID) VALUES (3, 'Develop new cinema web application', 14);

-- Sprint Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO Sprint (SprintGoalID, ProductGoalID, StartDate, EndDate, TimeboxID) VALUES (1, 1, '2024-09-15', '2024-09-30', 1);
INSERT INTO Sprint (SprintGoalID, ProductGoalID, StartDate, EndDate) VALUES (4, 1, '2024-10-01', NULL);

INSERT INTO Sprint (SprintGoalID, ProductGoalID, StartDate, EndDate, TimeboxID) VALUES (2, 2, '2024-09-17', '2024-09-30', 1);
INSERT INTO Sprint (SprintGoalID, ProductGoalID, StartDate, EndDate, TimeboxID) VALUES (5, 2, '2024-10-01', NULL, 1);

INSERT INTO Sprint (SprintGoalID, ProductGoalID, StartDate, EndDate, TimeboxID) VALUES (3, 3, '2024-09-17', '2024-09-30', 1);
INSERT INTO Sprint (SprintGoalID, ProductGoalID, StartDate, EndDate, TimeboxID) VALUES (6, 3, '2024-10-01', NULL, 1);

-- Increment Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO Increment (SprintID, SprintGoalID, ProductGoalID, Deadline, Description) VALUES (1, 1, 1, '2024-09-29', 'User authentication module completed');
INSERT INTO Increment (SprintID, SprintGoalID, ProductGoalID, Deadline, Description) VALUES (1, NULL, NULL, NULL, 'Amazing very usefull feature implemented.');
INSERT INTO Increment (SprintID, SprintGoalID, ProductGoalID, Deadline, Description) VALUES (3, 2, 2, NULL, 'Cooler character design completed');
INSERT INTO Increment (SprintID, SprintGoalID, ProductGoalID, Deadline, Description) VALUES (5, 3, 3, NULL, 'New reservation system implemented');

-- ProductBacklog
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO ProductBacklog (ProductGoalID) VALUES (1);
INSERT INTO ProductBacklog (ProductGoalID) VALUES (2);
INSERT INTO ProductBacklog (ProductGoalID) VALUES (3);

-- SprintBacklog
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO SprintBacklog (SprintID) VALUES (1);
INSERT INTO SprintBacklog (SprintID) VALUES (4);

INSERT INTO SprintBacklog (SprintID) VALUES (2);
INSERT INTO SprintBacklog (SprintID) VALUES (5);

INSERT INTO SprintBacklog (SprintID) VALUES (3);
INSERT INTO SprintBacklog (SprintID) VALUES (6);

-- WorkItemType Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
INSERT INTO WorkItemType (TypeName) VALUES ('User Story');
INSERT INTO WorkItemType (TypeName) VALUES ('Task');
INSERT INTO WorkItemType (TypeName) VALUES ('Bug');
INSERT INTO WorkItemType (TypeName) VALUES ('Spike');

-- BacklogItem Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Backlog Items for Team Atomic
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done) VALUES ('Refactor Login', 'Refactor login system', 1, 1, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done) VALUES ('2FA Implementation', 'Implement 2-factor authentication', 1, 1, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, ItemPriority) VALUES ('Optimize Recovery', 'Optimize password recovery process', 1, 1, 1, 3);

INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, ItemPriority) VALUES ('User Settings UI', 'Create UI for user settings', 1, 4, 0, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, ItemPriority) VALUES ('User Settings Backend', 'Backend for user settings', 1, 4, 0, 2);

-- Backlog Items for Team Bionic
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, ItemPriority) VALUES ('Hero Design', 'Design new hero character', 2, 2, 1, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, ItemPriority) VALUES ('Character Animations', 'Develop animations for character', 2, 2, 1, 2);

INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, ItemPriority) VALUES ('Scoring Algorithm', 'Develop scoring algorithm', 2, 5, 0, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, ItemPriority) VALUES ('Score Persistence', 'Implement score persistence', 2, 5, 0, 2);

-- Backlog Items for Team Cosmic
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, ItemPriority) VALUES ('Reservation DB', 'Create database schema for reservation', 3, 3, 1, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, ItemPriority) VALUES ('Reservation UI', 'Build reservation UI', 3, 3, 1, 2);

INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, ItemPriority) VALUES ('Movie Filtering', 'Improve movie selection filtering', 3, 6, 0, 1);
INSERT INTO BacklogItem (ItemName, ItemDescription, ProductBacklogID, SprintBacklogID, Done, ItemPriority) VALUES ('Recommendation Engine', 'Add recommendation engine', 3, 6, 0, 2);

-- WorkItem Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Work Items for Backlog Items of SprintGoal 1 Team Atomic
INSERT INTO WorkItem (BacklogItemID, AcceptanceCriteriaID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (1, 1, '2024-09-23', 1, 1, 'Refactor login system');
INSERT INTO WorkItem (BacklogItemID, AcceptanceCriteriaID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (2, 1, NULL, 1, 1, 'Implement 2-factor authentication');
INSERT INTO WorkItem (BacklogItemID, AcceptanceCriteriaID, DefinitionOfDoneID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (3, 1, 1, NULL, 1, 2, 'Optimize password recovery process');

-- Work Items for Backlog Items of SprintGoal 2 Team Bionic
INSERT INTO WorkItem (BacklogItemID, DefinitionOfDoneID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (4, 1, NULL, 2, 1, 'Create UI for user settings');
INSERT INTO WorkItem (BacklogItemID, DefinitionOfDoneID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (5, 1, NULL, 2, 1, 'Backend for user settings');

-- Work Items for Backlog Items of SprintGoal 3 Team Cosmic
INSERT INTO WorkItem (BacklogItemID, AcceptanceCriteriaID, DefinitionOfDoneID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (6, 3, 1, NULL, 3, 2, 'Design new hero character');
INSERT INTO WorkItem (BacklogItemID, AcceptanceCriteriaID, DefinitionOfDoneID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (7, 3, 1, NULL, 3, 1, 'Develop animations for character');

-- Work Items for Backlog Items of SprintGoal 4 Team Atomic
INSERT INTO WorkItem (BacklogItemID, AcceptanceCriteriaID, DefinitionOfDoneID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (8, 1, 1, NULL, NULL, 1, 'Develop scoring algorithm');
INSERT INTO WorkItem (BacklogItemID, AcceptanceCriteriaID, DefinitionOfDoneID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (9, 1, 1, NULL, NULL, 2, 'Implement score persistence');

-- Work Items for Backlog Items of SprintGoal 5 Team Bionic
INSERT INTO WorkItem (BacklogItemID, AcceptanceCriteriaID, DefinitionOfDoneID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (10, 2, 1, NULL, NULL, 1, 'Create database schema for reservation');
INSERT INTO WorkItem (BacklogItemID, AcceptanceCriteriaID, DefinitionOfDoneID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (11, 2, 1, NULL, NULL, 2, 'Build reservation UI');

-- Work Items for Backlog Items of SprintGoal 6 Team Cosmic
INSERT INTO WorkItem (BacklogItemID, AcceptanceCriteriaID, DefinitionOfDoneID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (12, 3, 1, NULL, NULL, 2, 'Improve movie selection filtering');
INSERT INTO WorkItem (BacklogItemID, AcceptanceCriteriaID, DefinitionOfDoneID, Deadline, IncrementID, WorkItemTypeID, Description) VALUES (13, 3, 1, NULL, NULL, 1, 'Add recommendation engine');

-- PersonWorkItem Data
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Team Atomic
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (3, 1); -- Grace works on WorkItem 1
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (4, 1); -- Uma works on WorkItem 1
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (5, 2); -- Victor works on WorkItem 2
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (6, 3); -- Wendy works on WorkItem 3
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (4, 4); -- Uma works on WorkItem 4
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (6, 5); -- Wendy works on WorkItem 5
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (2, 5); -- Product Owner on WorkItem 5

-- Team Bionic
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (9, 6);  -- Leo works on WorkItem 6
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (10, 6); -- Kate works on WorkItem 6
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (11, 7); -- Sam works on WorkItem 7
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (9, 8); -- Leo works on WorkItem 8
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (11, 9); -- Sam works on WorkItem 9

-- Team Cosmic
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (14, 10);  -- Olivia works on WorkItem 10
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (15, 11);  -- Quinn works on WorkItem 11
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (16, 12);  -- Rachel works on WorkItem 12
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (14, 13); -- Olivia works on WorkItem 13
INSERT INTO PersonWorkItem (PersonID, WorkItemID) VALUES (16, 13); -- Rachel works on WorkItem 13

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
