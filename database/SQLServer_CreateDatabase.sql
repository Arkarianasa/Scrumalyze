CREATE TABLE ScrumTeam (
    ScrumTeamID INT PRIMARY KEY IDENTITY(1,1),
    TeamName NVARCHAR(255) NOT NULL
);

CREATE TABLE Timebox (
    TimeboxID INT PRIMARY KEY IDENTITY(1,1),
    Duration FLOAT NOT NULL, -- Duration in hours
	TimeboxDescription NVARCHAR(255),
	ScrumTeamID INT NOT NULL,
	FOREIGN KEY (ScrumTeamID) REFERENCES ScrumTeam(ScrumTeamID)
);

CREATE TABLE AcceptanceCriteria (
    AcceptanceCriteriaID INT PRIMARY KEY IDENTITY(1,1),
    ConstraintDescription NVARCHAR(255) NOT NULL,
	ScrumTeamID INT NOT NULL,
	FOREIGN KEY (ScrumTeamID) REFERENCES ScrumTeam(ScrumTeamID)
);

CREATE TABLE DefinitionOfDone (
    DefinitionOfDoneID INT PRIMARY KEY IDENTITY(1,1),
    ConstraintDescription NVARCHAR(255) NOT NULL,
	ScrumTeamID INT NOT NULL,
	FOREIGN KEY (ScrumTeamID) REFERENCES ScrumTeam(ScrumTeamID),
);

CREATE TABLE ScrumRole (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL,  -- Example values: Stakeholder, Developer, SCRUM Master, Product Owner, Manager?
	RoleDescription NVARCHAR(255) NOT NULL,
);

CREATE TABLE Person (
    PersonID INT PRIMARY KEY IDENTITY(1,1),
    ScrumTeamID INT NOT NULL,
	RoleID INT NOT NULL,
    FirstName NVARCHAR(255) NOT NULL,
	LastName NVARCHAR(255) NOT NULL,
    FOREIGN KEY (ScrumTeamID) REFERENCES ScrumTeam(ScrumTeamID),
	FOREIGN KEY (RoleID) REFERENCES ScrumRole(RoleID)
);

CREATE TABLE SprintGoal (
    SprintGoalID INT PRIMARY KEY IDENTITY(1,1),
    Description NVARCHAR(255) NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
	CreatedByPersonID INT NOT NULL,
	FOREIGN KEY (CreatedByPersonID) REFERENCES Person(PersonID)
);

CREATE TABLE ProductGoal (
    ProductGoalID INT PRIMARY KEY IDENTITY(1,1),
    Description NVARCHAR(255) NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
	CreatedByPersonID INT NOT NULL,
	ScrumTeamID INT NOT NULL,
	FOREIGN KEY (ScrumTeamID) REFERENCES ScrumTeam(ScrumTeamID),
	FOREIGN KEY (CreatedByPersonID) REFERENCES Person(PersonID)
);

CREATE TABLE Sprint (
    SprintID INT PRIMARY KEY IDENTITY(1,1),
    SprintGoalID INT NOT NULL,
    ProductGoalID INT NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NULL,
	TimeboxID INT NULL,
    FOREIGN KEY (SprintGoalID) REFERENCES SprintGoal(SprintGoalID),
    FOREIGN KEY (ProductGoalID) REFERENCES ProductGoal(ProductGoalID),
	FOREIGN KEY (TimeboxID) REFERENCES Timebox(TimeboxID)
);

CREATE TABLE Increment (
    IncrementID INT PRIMARY KEY IDENTITY(1,1),
	Description NVARCHAR(255) NOT NULL,
    SprintID INT NULL,
    SprintGoalID INT NULL,
    ProductGoalID INT NULL,
	Deadline DATETIME NULL,
	ReceivedByID INT NULL,
    FOREIGN KEY (SprintID) REFERENCES Sprint(SprintID),
    FOREIGN KEY (SprintGoalID) REFERENCES SprintGoal(SprintGoalID),
    FOREIGN KEY (ProductGoalID) REFERENCES ProductGoal(ProductGoalID),
	FOREIGN KEY (ReceivedByID) REFERENCES Person(PersonID)
);

CREATE TABLE ProductBacklog (
    ProductBacklogID INT PRIMARY KEY IDENTITY(1,1),
    ProductGoalID INT NOT NULL,
    FOREIGN KEY (ProductGoalID) REFERENCES ProductGoal(ProductGoalID)
);

CREATE TABLE SprintBacklog (
    SprintBacklogID INT PRIMARY KEY IDENTITY(1,1),
    SprintID INT NOT NULL,
    FOREIGN KEY (SprintID) REFERENCES Sprint(SprintID)
);

CREATE TABLE BacklogItem (
    BacklogItemID INT PRIMARY KEY IDENTITY(1,1),
    ItemName NVARCHAR(100) NOT NULL,
	ItemDescription NVARCHAR(255) NOT NULL,
	ProductBacklogID INT NOT NULL,
    SprintBacklogID INT NULL,
    Done BIT NOT NULL DEFAULT 0, -- 0 for NOT ACTIVE, 1 for ACTIVE
	ItemPriority INT NULL, -- 1 - 10
    FOREIGN KEY (ProductBacklogID) REFERENCES ProductBacklog(ProductBacklogID),
    FOREIGN KEY (SprintBacklogID) REFERENCES SprintBacklog(SprintBacklogID)
);

CREATE TABLE ProcessStep (
    ProcessStepID INT PRIMARY KEY IDENTITY(1,1),
	ProcessStepName NVARCHAR(100) NOT NULL,
    SprintID INT NOT NULL,
	StartDate DATETIME NOT NULL,
    EndDate DATETIME NULL,
	TimeboxID INT NULL,
	GuidedByPersonID INT NULL,
    FOREIGN KEY (SprintID) REFERENCES Sprint(SprintID),
	FOREIGN KEY (TimeboxID) REFERENCES Timebox(TimeboxID),
	FOREIGN KEY (GuidedByPersonID) REFERENCES Person(PersonID)
);

CREATE TABLE WorkItemType (
    WorkItemTypeID INT PRIMARY KEY IDENTITY(1,1),
    TypeName NVARCHAR(50) NOT NULL -- Example values: Spike, User Story, Task, Bug
);

CREATE TABLE WorkItem (
    WorkItemID INT PRIMARY KEY IDENTITY(1,1),
	Description NVARCHAR(255) NOT NULL,
    BacklogItemID INT NULL,
    AcceptanceCriteriaID INT NULL,
	DefinitionOfDoneID INT NULL,
	Deadline DATETIME NULL,
	IncrementID INT NULL,
	WorkItemTypeID INT NOT NULL,
	TimeboxID INT NULL,
	Done BIT NOT NULL DEFAULT 0,
	FOREIGN KEY (BacklogItemID) REFERENCES BacklogItem(BacklogItemID),
    FOREIGN KEY (AcceptanceCriteriaID) REFERENCES AcceptanceCriteria(AcceptanceCriteriaID),
	FOREIGN KEY (DefinitionOfDoneID) REFERENCES DefinitionOfDone(DefinitionOfDoneID),
	FOREIGN KEY (IncrementID) REFERENCES Increment(IncrementID),
    FOREIGN KEY (WorkItemTypeID) REFERENCES WorkItemType(WorkItemTypeID),
	FOREIGN KEY (TimeboxID) REFERENCES Timebox(TimeboxID)
);

CREATE TABLE PersonWorkItem (
	PersonID INT,
	WorkItemID INT,
	PRIMARY KEY (PersonID, WorkItemID),
	FOREIGN KEY (PersonID) REFERENCES Person(PersonID),
	FOREIGN KEY (WorkItemID) REFERENCES WorkItem(WorkItemID)
);

CREATE TABLE Communication (
    CommunicationID INT PRIMARY KEY IDENTITY(1,1),
    SourcePersonID INT NOT NULL,
    TargetPersonID INT NOT NULL,
    CommunicationDescription NVARCHAR(255) NULL,
    FOREIGN KEY (SourcePersonID) REFERENCES Person(PersonID),
    FOREIGN KEY (TargetPersonID) REFERENCES Person(PersonID)
);

