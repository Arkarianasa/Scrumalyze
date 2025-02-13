
CREATE TABLE ScrumTeam (
    ScrumTeamID INT PRIMARY KEY IDENTITY(1,1),
    TeamName NVARCHAR(255) NOT NULL,
	WorkDayHours INT NOT NULL
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
	IsCompanyPolicy BIT NOT NULL, -- 0 for NOT Company Policy, 1 for IS Company Policy
	FOREIGN KEY (ScrumTeamID) REFERENCES ScrumTeam(ScrumTeamID),
);

CREATE TABLE ScrumRole (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL,  -- Example values: Stakeholder, Developer, SCRUM Master, Product Owner, Manager?
	RoleDescription NVARCHAR(255) NOT NULL,
	ScrumTeamID INT NULL, -- Is this role Team Specific?
	FOREIGN KEY (ScrumTeamID) REFERENCES ScrumTeam(ScrumTeamID),
);

CREATE TABLE Person (
    PersonID INT PRIMARY KEY IDENTITY(1,1),
    ScrumTeamID INT NOT NULL,
	RoleID INT NOT NULL,
    FirstName NVARCHAR(255) NOT NULL,
	LastName NVARCHAR(255) NOT NULL,
	IsScrumTeamMember BIT NOT NULL, -- 0 for NOT Team Member, 1 for IS Team Member
    FOREIGN KEY (ScrumTeamID) REFERENCES ScrumTeam(ScrumTeamID),
	FOREIGN KEY (RoleID) REFERENCES ScrumRole(RoleID)
);

CREATE TABLE SprintGoal (
    SprintGoalID INT PRIMARY KEY IDENTITY(1,1),
    Description NVARCHAR(255) NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
	ResponsiblePersonID INT NULL, -- IF NULL => Whole Team is Responsible
	FOREIGN KEY (ResponsiblePersonID) REFERENCES Person(PersonID)
);

CREATE TABLE ProductGoal (
    ProductGoalID INT PRIMARY KEY IDENTITY(1,1),
    Description NVARCHAR(255) NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
	ResponsiblePersonID INT NULL, -- IF NULL => Whole Team is Responsible
	ScrumTeamID INT NOT NULL,
	FOREIGN KEY (ScrumTeamID) REFERENCES ScrumTeam(ScrumTeamID),
	FOREIGN KEY (ResponsiblePersonID) REFERENCES Person(PersonID)
);

CREATE TABLE Sprint (
    SprintID INT PRIMARY KEY IDENTITY(1,1),
	ScrumTeamID INT NOT NULL,
    SprintGoalID INT NULL,
    ProductGoalID INT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NULL,
	TimeboxID INT NULL,
	FOREIGN KEY (ScrumTeamID) REFERENCES ScrumTeam(ScrumTeamID),
    FOREIGN KEY (SprintGoalID) REFERENCES SprintGoal(SprintGoalID),
    FOREIGN KEY (ProductGoalID) REFERENCES ProductGoal(ProductGoalID),
	FOREIGN KEY (TimeboxID) REFERENCES Timebox(TimeboxID)
);

CREATE TABLE Increment (
    IncrementID INT PRIMARY KEY IDENTITY(1,1),
	Description NVARCHAR(255) NOT NULL,
	Deadline  DATETIME NULL,
	ScrumTeamID INT NOT NULL,
    SprintID INT NULL,
    ProductGoalID INT NULL,
	ReceivedByID INT NULL,
	FOREIGN KEY (ScrumTeamID) REFERENCES ScrumTeam(ScrumTeamID),
    FOREIGN KEY (SprintID) REFERENCES Sprint(SprintID),
    FOREIGN KEY (ProductGoalID) REFERENCES ProductGoal(ProductGoalID),
	FOREIGN KEY (ReceivedByID) REFERENCES Person(PersonID)
);

CREATE TABLE PrioritizationScheme (
    PrioritizationSchemeID INT PRIMARY KEY IDENTITY(1,1),
    SchemeName NVARCHAR(100) NOT NULL
);

CREATE TABLE PrioritizationLevel (
    PrioritizationLevelID INT PRIMARY KEY IDENTITY(1,1),
    PrioritizationSchemeID INT NOT NULL,
    LevelName NVARCHAR(50) NOT NULL, -- Name of the level (e.g., "Low", "Medium", "High")
    LevelValue INT NOT NULL, -- Numerical value for the level (e.g., Low = 3, Medium = 2, High = 1)
    FOREIGN KEY (PrioritizationSchemeID) REFERENCES PrioritizationScheme(PrioritizationSchemeID)
);

CREATE TABLE ProductBacklog (
    ProductBacklogID INT PRIMARY KEY IDENTITY(1,1),
	ScrumTeamID INT NOT NULL,
    ProductGoalID INT NULL,
	PrimaryPrioritizationSchemeID INT NULL,
    SecondaryPrioritizationSchemeID INT NULL,
	ResponsiblePersonID INT NULL, -- IF NULL => Whole Team is Responsible
	FOREIGN KEY (ScrumTeamID) REFERENCES ScrumTeam(ScrumTeamID),
    FOREIGN KEY (ProductGoalID) REFERENCES ProductGoal(ProductGoalID),
	FOREIGN KEY (PrimaryPrioritizationSchemeID) REFERENCES PrioritizationScheme(PrioritizationSchemeID),
    FOREIGN KEY (SecondaryPrioritizationSchemeID) REFERENCES PrioritizationScheme(PrioritizationSchemeID),
	FOREIGN KEY (ResponsiblePersonID) REFERENCES Person(PersonID)
);

CREATE TABLE SprintBacklog (
    SprintBacklogID INT PRIMARY KEY IDENTITY(1,1),
    SprintID INT NOT NULL,
	ResponsiblePersonID INT NULL, -- IF NULL => Whole Team is Responsible
    FOREIGN KEY (SprintID) REFERENCES Sprint(SprintID),
	FOREIGN KEY (ResponsiblePersonID) REFERENCES Person(PersonID)
);

CREATE TABLE BacklogItem (
    BacklogItemID INT PRIMARY KEY IDENTITY(1,1),
    ItemName NVARCHAR(100) NOT NULL,
	ItemDescription NVARCHAR(255) NOT NULL,
	ProductBacklogID INT NOT NULL,
    SprintBacklogID INT NULL,
    Done BIT NOT NULL DEFAULT 0, -- 0 for NOT ACTIVE, 1 for ACTIVE
	PrimaryPriorityValue INT NULL,
	SecondaryPriorityValue INT NULL,
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
	Deadline DATETIME NULL,
	IncrementID INT NULL,
	WorkItemTypeID INT NULL,
	TimeboxID INT NULL,
	Done BIT NOT NULL DEFAULT 0,
	FOREIGN KEY (BacklogItemID) REFERENCES BacklogItem(BacklogItemID),
	FOREIGN KEY (IncrementID) REFERENCES Increment(IncrementID),
    FOREIGN KEY (WorkItemTypeID) REFERENCES WorkItemType(WorkItemTypeID),
	FOREIGN KEY (TimeboxID) REFERENCES Timebox(TimeboxID)
);

CREATE TABLE WorkItem_Person (
	PersonID INT NOT NULL,
	WorkItemID INT NOT NULL,
	PRIMARY KEY (PersonID, WorkItemID),
	FOREIGN KEY (PersonID) REFERENCES Person(PersonID),
	FOREIGN KEY (WorkItemID) REFERENCES WorkItem(WorkItemID)
);

CREATE TABLE WorkItem_AcceptanceCriteria (
    WorkItemID INT NOT NULL,
    AcceptanceCriteriaID INT NOT NULL,
    PRIMARY KEY (WorkItemID, AcceptanceCriteriaID),
    FOREIGN KEY (WorkItemID) REFERENCES WorkItem(WorkItemID) ON DELETE CASCADE,
    FOREIGN KEY (AcceptanceCriteriaID) REFERENCES AcceptanceCriteria(AcceptanceCriteriaID) ON DELETE CASCADE
);

CREATE TABLE WorkItem_DefinitionOfDone (
    WorkItemID INT NOT NULL,
    DefinitionOfDoneID INT NOT NULL,
    PRIMARY KEY (WorkItemID, DefinitionOfDoneID),
    FOREIGN KEY (WorkItemID) REFERENCES WorkItem(WorkItemID) ON DELETE CASCADE,
    FOREIGN KEY (DefinitionOfDoneID) REFERENCES DefinitionOfDone(DefinitionOfDoneID) ON DELETE CASCADE
);

CREATE TABLE Communication (
    CommunicationID INT PRIMARY KEY IDENTITY(1,1),
    SourcePersonID INT NOT NULL,
    TargetPersonID INT NOT NULL,
    CommunicationDescription NVARCHAR(255) NULL,
    FOREIGN KEY (SourcePersonID) REFERENCES Person(PersonID),
    FOREIGN KEY (TargetPersonID) REFERENCES Person(PersonID)
);

