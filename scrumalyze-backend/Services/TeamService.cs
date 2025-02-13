using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Scrumalyze.Data;
using Scrumalyze.Dtos;
using Scrumalyze.Models;
using System.Collections.Generic;

namespace Scrumalyze.Services
{
    public class TeamService(ScrumalyzeContext context, IMapper mapper)
    {
        private readonly ScrumalyzeContext _context = context;
        private readonly IMapper _mapper = mapper;

        public List<Person> GetPersonList(int teamID)
        {  
            return [.. _context.Person
                .Include(p => p.Role)
                .Where(p => p.ScrumTeamID == teamID)];
        }
        public ProductGoal? GetProductGoal(int teamID)
        {
            return _context.ProductGoal.Include(pg => pg.ResponsiblePerson).FirstOrDefault(pg => pg.ScrumTeamID == teamID);
        }
        public List<DefinitionOfDone> GetDoDList(int teamID)
        {
            return [.. _context.DefinitionOfDone.Where(dod => dod.ScrumTeamID == teamID)];
        }
        public List<AcceptanceCriteria> GetAcceptanceCriteriaList(int teamID)
        {
            return [.. _context.AcceptanceCriteria.Where(ac => ac.ScrumTeamID == teamID)];
        }
        public List<Timebox> GetTimeboxList(int teamID)
        {
            return [.. _context.Timebox.Where(t => t.ScrumTeamID == teamID)];
        }
        public ProductBacklog? GetProductBacklog(int teamID)
        {
            return _context.ProductBacklog
                .Include(pb => pb.BacklogItems)
                .Include(pb => pb.ResponsiblePerson)
                .FirstOrDefault(pb => pb.ScrumTeamID == teamID);

        }
        public List<WorkItem> GetWorkItemList(int teamID)
        {
            return [.. _context.WorkItem
                .Include(wi => wi.Persons)
                .Include(wi => wi.AcceptanceCriterias)
                .Include(wi => wi.DefinitionsOfDone)
                .Where(wi => wi.BacklogItem != null
                             && wi.BacklogItem.ProductBacklog != null
                             && wi.BacklogItem.ProductBacklog.ProductGoal != null
                             && wi.BacklogItem.ProductBacklog.ScrumTeamID == teamID)];
        }
        public List<Sprint> GetSprintList(int teamID)
        {
            return [.. _context.Sprint
                .Include(s => s.SprintGoal)
                .Where(s => s.ScrumTeamID == teamID)];
        }
        public List<SprintBacklog> GetSprintBacklogList(int teamID)
        {
            return [.. _context.SprintBacklog.Where(sb => sb.Sprint.ScrumTeamID == teamID)];
        }
        public List<ProcessStep> GetProcessStepList(int teamID)
        {
            return [.. _context.ProcessStep.Where(ps => ps.Sprint.ScrumTeamID == teamID)];
        }
        public List<Increment> GetIncrementList(int teamID)
        {
            return [.. _context.Increment
                .Where(i => i.ScrumTeamID == teamID)];
        }

        public async Task<bool> CreateTeamAsync(ScrumTeamDto teamDto)
        {
            // Map ScrumTeam
            ScrumTeam scrumTeam = _mapper.Map<ScrumTeam>(teamDto);

            // Fetch general roles (IDs 1–4)
            List<ScrumRole> generalRoles = await _context.ScrumRole
                .Where(r => r.ScrumTeamID == null)
                .ToListAsync();

            // Prepare team-specific roles
            List<ScrumRole> teamSpecificRoles = new();

            foreach (var roleDto in teamDto.ScrumRoles)
            {
                // Add team-specific roles to the context (they'll be saved with ScrumTeam)
                var newRole = new ScrumRole
                {
                    RoleName = roleDto.RoleName,
                    RoleDescription = roleDto.RoleDescription ?? "Team-specific role",
                    ScrumTeam = scrumTeam
                };
                teamSpecificRoles.Add(newRole);
            }

            // Combine general and team-specific roles
            List<ScrumRole> allRoles = generalRoles.Concat(teamSpecificRoles).ToList();

            // Map Persons and associate them with ScrumTeam and Roles
            List<Person> persons = new();

            foreach (var personDto in teamDto.Persons)
            {
                var person = _mapper.Map<Person>(personDto);
                person.ScrumTeam = scrumTeam;

                if (personDto.RoleID <= 4) // General roles (IDs 1–4)
                {
                    // Ensure the role exists in generalRoles
                    var role = generalRoles.SingleOrDefault(r => r.RoleID == personDto.RoleID);
                    person.Role = role ?? throw new InvalidOperationException($"Invalid RoleID: {personDto.RoleID}. No matching general role found.");
                }
                else // Team-specific roles
                {
                    int teamSpecificIndex = personDto.RoleID - 5; // Convert to zero-based index for team-specific roles
                    if (teamSpecificIndex >= 0 && teamSpecificIndex < teamSpecificRoles.Count)
                    {
                        person.Role = teamSpecificRoles[teamSpecificIndex];
                    }
                    else
                    {
                        throw new InvalidOperationException($"Invalid RoleID: {personDto.RoleID}. Index does not match any team-specific role.");
                    }
                }

                persons.Add(person);
            }

            // Assign the mapped Persons to the ScrumTeam
            scrumTeam.Persons = persons;

            // Map ProductGoals and associate them with ScrumTeam and Persons
            List<ProductGoal> productGoals = new();

            foreach (var productGoalDto in teamDto.ProductGoals)
            {
                // Map ProductGoalDto to ProductGoal
                var productGoal = _mapper.Map<ProductGoal>(productGoalDto);

                // Check if ResponsiblePersonDtoID is not null and within the valid range
                if (productGoalDto.ResponsiblePersonDtoID != null)
                {
                    if (productGoalDto.ResponsiblePersonDtoID >= 0 && productGoalDto.ResponsiblePersonDtoID < persons.Count)
                    {
                        productGoal.ResponsiblePerson = persons[(int)productGoalDto.ResponsiblePersonDtoID];
                    }
                    else
                    {
                        throw new InvalidOperationException($"Invalid ResponsiblePersonDtoID index: {productGoalDto.ResponsiblePersonDtoID}. It must be within the range of the persons list.");
                    }
                }
                else
                {
                    productGoal.ResponsiblePerson = null;
                }

                // Associate ProductGoal with ScrumTeam
                productGoal.ScrumTeam = scrumTeam;

                // Add to the list of mapped ProductGoals
                productGoals.Add(productGoal);
            }
            // Map ProductBacklog and associate with ScrumTeam and ProductGoals
            var productBacklog = _mapper.Map<ProductBacklog>(teamDto.ProductBacklog);

            if (teamDto.ProductBacklog.ProductGoalID != null)
            {
                productBacklog.ProductGoal = productGoals.FirstOrDefault(pg => pg.ProductGoalID == teamDto.ProductBacklog.ProductGoalID);
            }

            if (teamDto.ProductBacklog.ResponsiblePersonID != null)
            {
                productBacklog.ResponsiblePerson = persons.FirstOrDefault(p => p.PersonID == teamDto.ProductBacklog.ResponsiblePersonID);
            }

            productBacklog.ScrumTeam = scrumTeam;

            // Map BacklogItems and associate them with ProductBacklog
            List<BacklogItem> backlogItems = new();

            foreach (var backlogItemDto in teamDto.BacklogItems)
            {
                var backlogItem = _mapper.Map<BacklogItem>(backlogItemDto);

                if (backlogItemDto.ProductBacklogID != null)
                {
                    backlogItem.ProductBacklog = productBacklog;
                }

                backlogItems.Add(backlogItem);
            }

            productBacklog.BacklogItems = backlogItems;

            // Map DefinitionsOfDone
            List<DefinitionOfDone> definitionsOfDone = _mapper.Map<List<DefinitionOfDone>>(teamDto.DefinitionsOfDone);

            foreach (var definitionOfDone in definitionsOfDone)
            {
                definitionOfDone.ScrumTeam = scrumTeam;
            }

            // Map Timeboxes
            List<Timebox> timeboxes = _mapper.Map<List<Timebox>>(teamDto.Timeboxes);

            foreach (var timebox in timeboxes)
            {
                timebox.ScrumTeam = scrumTeam;
            }

            // Map Sprints and associate with ScrumTeam, Timeboxes, and other entities
            List<Sprint> sprints = new();
            foreach (var sprintDto in teamDto.Sprints)
            {
                var sprint = new Sprint
                {
                    StartDate = sprintDto.StartDate,
                    EndDate = sprintDto.EndDate,
                    ScrumTeam = scrumTeam
                };

                // Map SprintGoal manually
                if (!string.IsNullOrWhiteSpace(sprintDto.SprintGoal))
                {
                    sprint.SprintGoal = new SprintGoal
                    {
                        Description = sprintDto.SprintGoal,
                        CreatedDate = DateTime.Now
                    };
                }

                // Map Timebox
                if (sprintDto.TimeboxDtoID != null)
                {
                    if (sprintDto.TimeboxDtoID >= 0 && sprintDto.TimeboxDtoID < timeboxes.Count)
                    {
                        sprint.Timebox = timeboxes[(int)sprintDto.TimeboxDtoID];
                    }
                    else
                    {
                        throw new InvalidOperationException($"Invalid TimeboxDtoID index: {sprintDto.TimeboxDtoID}. It must be within the range of the timeboxes list.");
                    }
                }

                // Map ProductGoal
                if (sprintDto.ProductGoalID != null)
                {
                    sprint.ProductGoal = productGoals.FirstOrDefault(pg => pg.ProductGoalID == sprintDto.ProductGoalID);
                }

                // Map SprintGoal
                var sprintGoal = new SprintGoal
                {
                    Description = sprintDto.SprintGoal,
                    CreatedDate = DateTime.Now
                };

                if (sprintDto.GoalResponsiblePersonID != null)
                {
                    if (sprintDto.GoalResponsiblePersonID >= 0 && sprintDto.GoalResponsiblePersonID < persons.Count)
                    {
                        sprintGoal.ResponsiblePerson = persons[(int)sprintDto.GoalResponsiblePersonID];
                    }
                    else
                    {
                        throw new InvalidOperationException($"Invalid GoalResponsiblePersonID index: {sprintDto.GoalResponsiblePersonID}. It must be within the range of the persons list.");
                    }
                }

                sprint.SprintGoal = sprintGoal;

                // Map SprintBacklog
                var sprintBacklog = new SprintBacklog
                {
                    Sprint = sprint
                };

                if (sprintDto.BacklogResponsiblePersonID != null)
                {
                    if (sprintDto.BacklogResponsiblePersonID >= 0 && sprintDto.BacklogResponsiblePersonID < persons.Count)
                    {
                        sprintBacklog.ResponsiblePerson = persons[(int)sprintDto.BacklogResponsiblePersonID];
                    }
                    else
                    {
                        throw new InvalidOperationException($"Invalid BacklogResponsiblePersonID index: {sprintDto.BacklogResponsiblePersonID}. It must be within the range of the persons list.");
                    }
                }

                // Associate BacklogItems with SprintBacklog
                List<BacklogItem> sprintBacklogItems = new();
                foreach (var backlogItemIndex in sprintDto.BacklogItems)
                {
                    if (backlogItemIndex >= 0 && backlogItemIndex < backlogItems.Count)
                    {
                        sprintBacklogItems.Add(backlogItems[backlogItemIndex]);
                    }
                    else
                    {
                        throw new InvalidOperationException($"Invalid BacklogItem index: {backlogItemIndex}. It must be within the range of the backlog items list.");
                    }
                }

                sprintBacklog.BacklogItems = sprintBacklogItems;

                // Associate SprintBacklog and SprintGoal with Sprint
                sprintBacklog.Sprint = sprint;
                sprint.SprintGoal = sprintGoal;

                // Add to list of Sprints
                sprints.Add(sprint);
            }

            // Map WorkItems
            List<WorkItem> workItems = new();

            foreach (var workItemDto in teamDto.WorkItems)
            {
                var workItem = new WorkItem
                {
                    Description = workItemDto.Description,
                    Deadline = workItemDto.Deadline,
                    Done = workItemDto.Done,
                    WorkItemTypeID = workItemDto.WorkItemTypeID,
                    Persons = new List<WorkItem_Person>(), // Initialize empty list
                    DefinitionsOfDone = new List<WorkItem_DefinitionOfDone>(), // Initialize empty list
                    AcceptanceCriterias = new List<WorkItem_AcceptanceCriteria>() // Initialize empty list
                };

                // Map BacklogItem
                if (workItemDto.BacklogItemDtoID != null)
                {
                    if (workItemDto.BacklogItemDtoID >= 0 && workItemDto.BacklogItemDtoID < backlogItems.Count)
                    {
                        workItem.BacklogItem = backlogItems[(int)workItemDto.BacklogItemDtoID];
                        workItem.BacklogItemID = workItem.BacklogItem?.BacklogItemID;
                    }
                    else
                    {
                        throw new InvalidOperationException($"Invalid BacklogItemDtoID: {workItemDto.BacklogItemDtoID}. No matching BacklogItem found.");
                    }
                }

                // Map Timebox
                if (workItemDto.TimeboxDtoID != null)
                {
                    if (workItemDto.TimeboxDtoID >= 0 && workItemDto.TimeboxDtoID < timeboxes.Count)
                    {
                        workItem.Timebox = timeboxes[(int)workItemDto.TimeboxDtoID];
                        workItem.TimeboxID = workItem.Timebox?.TimeboxID;
                    }
                    else
                    {
                        throw new InvalidOperationException($"Invalid TimeboxDtoID: {workItemDto.TimeboxDtoID}. No matching Timebox found.");
                    }
                }

                // Map DefinitionsOfDone
                if (workItemDto.DefinitionOfDoneIDs != null)
                {
                    var workItemDefinitionsOfDone = workItemDto.DefinitionOfDoneIDs
                        .Where(definitionId => definitionId >= 0 && definitionId < definitionsOfDone.Count) // Ensure index is within range
                        .Select(definitionId => new WorkItem_DefinitionOfDone
                        {
                            WorkItem = workItem,
                            DefinitionOfDone = definitionsOfDone[definitionId] // Safe indexing
                        })
                        .ToList();

                    if (workItemDefinitionsOfDone.Any())
                    {
                        workItem.DefinitionsOfDone = workItemDefinitionsOfDone;
                    }
                }


                // Map AcceptanceCriterias (if not null)
                if (workItemDto.AcceptanceCriterias != null)
                {
                    var workItemAcceptanceCriterias = workItemDto.AcceptanceCriterias
                        .Select((criteria, index) => new WorkItem_AcceptanceCriteria
                        {
                            WorkItem = workItem,
                            AcceptanceCriteria = new AcceptanceCriteria
                            {
                                ConstraintDescription = criteria,
                                ScrumTeam = scrumTeam
                            }
                        })
                        .ToList();

                    workItem.AcceptanceCriterias = workItemAcceptanceCriterias;
                }

                // Map Working Persons
                var workingPersons = workItemDto.WorkingPersons
                    .Select(personDto => persons.FirstOrDefault(p => p.PersonID == personDto.RoleID))
                    .Where(person => person != null)
                    .Select(person => new WorkItem_Person
                    {
                        WorkItem = workItem,
                        Person = person!
                    })
                    .ToList();

                workItem.Persons = workingPersons;

                // Add work item to the list
                workItems.Add(workItem);
            }

            // Map Increments
            List<Increment> increments = new();

            foreach (var incrementDto in teamDto.Increments)
            {
                var increment = new Increment
                {
                    ScrumTeam = scrumTeam, // Assign ScrumTeam
                    ScrumTeamID = scrumTeam.ScrumTeamID,
                    Description = incrementDto.Description,
                    Deadline = incrementDto.Deadline
                };

                // Map Related Sprint
                if (incrementDto.RelatedSprintDtoID >= 0 && incrementDto.RelatedSprintDtoID < sprints.Count)
                {
                    increment.Sprint = sprints[incrementDto.RelatedSprintDtoID];
                    increment.SprintID = increment.Sprint.SprintID;
                }
                else
                {
                    throw new InvalidOperationException($"Invalid RelatedSprintDtoID: {incrementDto.RelatedSprintDtoID}. Index is out of range.");
                }

                // Map Related ProductGoal
                if (incrementDto.RelatedProductGoalID != null)
                {
                    increment.ProductGoal = productGoals.FirstOrDefault(pg => pg.ProductGoalID == incrementDto.RelatedProductGoalID);
                    increment.ProductGoalID = increment.ProductGoal?.ProductGoalID;
                }

                // Map ReceivedBy Person
                if (incrementDto.ReceivedByPersonDtoID != null)
                {
                    if (incrementDto.ReceivedByPersonDtoID >= 0 && incrementDto.ReceivedByPersonDtoID < persons.Count)
                    {
                        increment.ReceivedBy = persons[(int)incrementDto.ReceivedByPersonDtoID];
                        increment.ReceivedByID = increment.ReceivedBy.PersonID;
                    }
                    else
                    {
                        throw new InvalidOperationException($"Invalid ReceivedByPersonDtoID: {incrementDto.ReceivedByPersonDtoID}. Index is out of range.");
                    }
                }

                // Associate WorkItems
                foreach (var workItemIndex in incrementDto.WorkItems)
                {
                    if (workItemIndex >= 0 && workItemIndex < workItems.Count)
                    {
                        var workItem = workItems[workItemIndex];
                        workItem.Increment = increment; // Link WorkItem to Increment
                        workItem.IncrementID = increment.IncrementID; // Set IncrementID for WorkItem
                    }
                    else
                    {
                        throw new InvalidOperationException($"Invalid WorkItem index: {workItemIndex}. Index is out of range.");
                    }
                }

                // Add Increment to the list
                increments.Add(increment);
            }
            

            // Add entities to context
            _context.ScrumTeam.Add(scrumTeam);
            _context.DefinitionOfDone.AddRange(definitionsOfDone);
            _context.Timebox.AddRange(timeboxes);
            _context.BacklogItem.AddRange(backlogItems);
            _context.Sprint.AddRange(sprints);
            _context.WorkItem.AddRange(workItems);
            _context.Increment.AddRange(increments);

            await _context.SaveChangesAsync();
            
            return true;
        }
    }
}
