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
            return _context.ProductGoal.Include(pg => pg.CreatedByPerson).FirstOrDefault(pg => pg.ScrumTeamID == teamID);
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
                .Include(pg => pg.BacklogItems)
                .FirstOrDefault(pb => pb.ProductGoal.ScrumTeamID == teamID);

        }
        public List<WorkItem> GetWorkItemList(int teamID)
        {
            return [.. _context.WorkItem
                .Include(wi => wi.PersonWorkItems)
                .Where(wi => wi.BacklogItem != null
                             && wi.BacklogItem.ProductBacklog != null
                             && wi.BacklogItem.ProductBacklog.ProductGoal != null
                             && wi.BacklogItem.ProductBacklog.ProductGoal.ScrumTeamID == teamID)];
        }
        public List<Sprint> GetSprintList(int teamID)
        {
            return [.. _context.Sprint
                .Include(s => s.SprintGoal)
                .Where(s => s.ProductGoal.ScrumTeamID == teamID)];
        }
        public List<SprintBacklog> GetSprintBacklogList(int teamID)
        {
            return [.. _context.SprintBacklog.Where(sb => sb.Sprint.ProductGoal.ScrumTeamID == teamID)];
        }
        public List<SprintGoal> GetSprintGoalList(int teamID)
        {
            return [.. _context.SprintGoal.Where(sg => sg.CreatedByPerson.ScrumTeamID == teamID)];
        }
        public List<ProcessStep> GetProcessStepList(int teamID)
        {
            return [.. _context.ProcessStep.Where(ps => ps.Sprint.ProductGoal.ScrumTeamID == teamID)];
        }
        public List<Increment> GetIncrementList(int teamID)
        {
            return [.. _context.Increment
                .Where(i => i.Sprint != null
                            && i.Sprint.ProductGoal != null
                            && i.Sprint.ProductGoal.ScrumTeamID == teamID)];
        }

        public async Task<bool> CreateTeamAsync(ScrumTeamDto teamDto)
        {
            ScrumTeam scrumTeam = _mapper.Map<ScrumTeam>(teamDto);
            List<Person> persons = _mapper.Map<List<Person>>(teamDto.Persons);

            foreach (Person person in persons)
            {
                person.ScrumTeam = scrumTeam;
            }
            scrumTeam.Persons = persons;

            ProductGoal productGoal = _mapper.Map<ProductGoal>(teamDto.ProductGoal);
            productGoal.CreatedByPerson = persons[teamDto.ProductGoal.CreatedByPersonDtoID];
            productGoal.ScrumTeam = scrumTeam;

            List<AcceptanceCriteria> acceptanceCriterias = _mapper.Map<List<AcceptanceCriteria>>(teamDto.AcceptanceCriterias);
            foreach (var acceptanceCriteria in acceptanceCriterias)
            {
                acceptanceCriteria.ScrumTeam = scrumTeam;
            }

            List<DefinitionOfDone> definitionsOfDone = _mapper.Map<List<DefinitionOfDone>>(teamDto.DefinitionOfDone);
            foreach (var definitionOfDone in definitionsOfDone)
            {
                definitionOfDone.ScrumTeam = scrumTeam;
            }

            List<Timebox> timeboxes = _mapper.Map<List<Timebox>>(teamDto.Timeboxes);
            foreach (var timebox in timeboxes)
            {
                timebox.ScrumTeam = scrumTeam;
            }

            List<BacklogItem> backlogItems = _mapper.Map<List<BacklogItem>>(teamDto.BacklogItems);

            ProductBacklog productBacklog = new()
            {
                ProductGoal = productGoal,
                BacklogItems = backlogItems
            };

            foreach (var backlogItem in backlogItems)
            {
                backlogItem.ProductBacklog = productBacklog;
            }

            List<Sprint> sprints = [];
            foreach (var sprintDto in teamDto.Sprints)
            {
                SprintGoal sprintGoal = new()
                {
                    Description = sprintDto.SprintGoal,
                    CreatedByPerson = persons[sprintDto.GoalCreatedByPersonID]
                };

                Sprint sprint = new()
                {
                    SprintGoal = sprintGoal,
                    ProductGoal = productGoal,
                    StartDate = sprintDto.StartDate,
                    EndDate = sprintDto.EndDate,
                    Timebox = sprintDto.TimeboxDtoID.HasValue ? timeboxes[sprintDto.TimeboxDtoID.Value] : null
                };

                // Associate backlog items to the sprint's backlog
                List<BacklogItem> sprintBacklogItems = backlogItems
                    .Where(bi => sprintDto.BacklogItems.Contains(bi.BacklogItemID))
                    .ToList();

                SprintBacklog sprintBacklog = new() { Sprint = sprint, BacklogItems = sprintBacklogItems };

                foreach (var backlogItem in sprintBacklogItems)
                {
                    backlogItem.SprintBacklog = sprintBacklog;
                }

                sprints.Add(sprint);
            }

            // Create WorkItems
            List<WorkItem> workItems = [];
            foreach (var workItemDto in teamDto.WorkItems)
            {
                var workItem = _mapper.Map<WorkItem>(workItemDto);

                if (workItemDto.BacklogItemDtoID.HasValue)
                    workItem.BacklogItem = backlogItems[workItemDto.BacklogItemDtoID.Value];

                // Set AcceptanceCriteria if needed with null checks
                if (workItemDto.AcceptanceCriteriaID.HasValue && acceptanceCriterias.Count > workItemDto.AcceptanceCriteriaID.Value)
                    workItem.AcceptanceCriteria = acceptanceCriterias[workItemDto.AcceptanceCriteriaID.Value];

                // Set DefinitionOfDone if needed with null checks
                if (workItemDto.DefinitionOfDoneID.HasValue && definitionsOfDone.Count > workItemDto.DefinitionOfDoneID.Value)
                    workItem.DefinitionOfDone = definitionsOfDone[workItemDto.DefinitionOfDoneID.Value];

                // Set WorkItemType
                workItem.WorkItemTypeID = workItemDto.WorkItemTypeID;

                // Associate WorkingPersons
                if (workItemDto.WorkingPersons != null) // Check if WorkingPersons is not null
                {
                    // Ensure PersonWorkItems is initialized
                    workItem.PersonWorkItems ??= [];

                    foreach (var workPerson in workItemDto.WorkingPersons)
                    {
                        // Check if workPerson is not null to avoid NullReferenceException
                        if (workPerson != null)
                        {
                            var person = persons.FirstOrDefault(p => p.FirstName == workPerson.FirstName && p.LastName == workPerson.LastName && p.RoleID == workPerson.RoleID);
                            if (person != null)
                                workItem.PersonWorkItems.Add(new PersonWorkItem { Person = person, WorkItem = workItem });
                        }
                    }
                }

                workItems.Add(workItem);
            }

            // Create Increments
            List<Increment> increments = [];
            foreach (var incrementDto in teamDto.Increments)
            {
                Increment increment = _mapper.Map<Increment>(incrementDto);

                // Set the related Sprint
                increment.Sprint = sprints[incrementDto.RelatedSprintDtoID];

                // Set the person who received it
                if (incrementDto.ReceivedByPersonDtoID.HasValue)
                    increment.ReceivedBy = persons[incrementDto.ReceivedByPersonDtoID.Value];

                // Set the ProductGoal
                increment.ProductGoal = productGoal;

                // Add the increment to the list
                increments.Add(increment);
            }

            // Add entities to context
            _context.ScrumTeam.Add(scrumTeam);
            _context.AcceptanceCriteria.AddRange(acceptanceCriterias);
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
