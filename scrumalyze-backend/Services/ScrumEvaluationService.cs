using Microsoft.EntityFrameworkCore;
using Scrumalyze.Classes;
using Scrumalyze.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Scrumalyze.Services
{
    public class ScrumEvaluationService
    {
        private readonly ScrumalyzeContext _context;

        public ScrumEvaluationService(ScrumalyzeContext context)
        {
            _context = context;
        }

        public ScrumEvaluationResult? EvaluateScrumImplementation(int teamID)
        {
            // Get the Scrum team by team ID
            var team = _context.ScrumTeam.FirstOrDefault(t => t.ScrumTeamID == teamID);

            if (team == null)
                return null;

            var result = new ScrumEvaluationResult(teamID, team.TeamName);

            // Pass the team ID to each evaluation method
            EvaluateDefinitionOfDone(result, team.ScrumTeamID);
            EvaluateAcceptanceCriteria(result, team.ScrumTeamID);
            EvaluateGatekeeping(result, team.ScrumTeamID);
            EvaluateProductOwnerFailures(result, team.ScrumTeamID);
            EvaluateProductOwnerInadequacy(result, team.ScrumTeamID);
            EvaluateTimeboxIssues(result, team.ScrumTeamID);
            EvaluateDeadlines(result, team.ScrumTeamID);
            EvaluateIncrementBinding(result, team.ScrumTeamID);

            return result;
        }

        private void EvaluateDefinitionOfDone(ScrumEvaluationResult result, int scrumTeamId)
        {
            var workItemsWithoutDoD = _context.WorkItem
                .Where(w => w.BacklogItemID != null &&
                            _context.BacklogItem.Any(b => b.BacklogItemID == w.BacklogItemID &&
                                                          _context.ProductBacklog.Any(pb => pb.ProductBacklogID == b.ProductBacklogID &&
                                                          _context.ProductGoal.Any(pg => pg.ProductGoalID == pb.ProductGoalID &&
                                                          pg.CreatedByPerson.ScrumTeamID == scrumTeamId))) &&
                            w.DefinitionOfDoneID == null)
                .ToList();

            if (workItemsWithoutDoD.Any())
            {
                result.AddTest("Absence of Definition of Done", "Some work items lack a Definition of Done.", false, SeverityLevel.Major);
            }
            else
            {
                result.AddTest("Definition of Done Present", "All work items have a Definition of Done.", true, SeverityLevel.None);
            }
        }

        private void EvaluateAcceptanceCriteria(ScrumEvaluationResult result, int scrumTeamId)
        {
            var workItemsWithoutAC = _context.WorkItem
                .Where(w => w.BacklogItemID != null &&
                            _context.BacklogItem.Any(b => b.BacklogItemID == w.BacklogItemID &&
                                                          _context.ProductBacklog.Any(pb => pb.ProductBacklogID == b.ProductBacklogID &&
                                                          _context.ProductGoal.Any(pg => pg.ProductGoalID == pb.ProductGoalID &&
                                                          pg.CreatedByPerson.ScrumTeamID == scrumTeamId))) &&
                            w.AcceptanceCriteriaID == null)
                .ToList();

            if (workItemsWithoutAC.Any())
            {
                result.AddTest("Absence of Acceptance Criteria", "Some work items are missing Acceptance Criteria.", false, SeverityLevel.Minor);
            }
            else
            {
                result.AddTest("Acceptance Criteria Present", "All work items have proper Acceptance Criteria.", true, SeverityLevel.None);
            }
        }

        private void EvaluateGatekeeping(ScrumEvaluationResult result, int scrumTeamId)
        {
            var communicationsWithStakeholders = _context.Communication
                .Where(c => (c.SourcePerson.Role.RoleName == "Stakeholder" && c.TargetPerson.ScrumTeamID == scrumTeamId) ||
                            (c.SourcePerson.ScrumTeamID == scrumTeamId && c.TargetPerson.Role.RoleName == "Stakeholder"))
                .ToList();

            if (!communicationsWithStakeholders.Any())
            {
                result.AddTest("No Communication with Stakeholders", "No communication between Stakeholders and Scrum team members.", false, SeverityLevel.Major);
            }
            else
            {
                var communicationsBetweenStakeholdersDevelopers = _context.Communication
                    .Where(c => (c.SourcePerson.Role.RoleName == "Stakeholder" && (c.TargetPerson.Role.RoleName == "Developer" && c.SourcePerson.ScrumTeamID == scrumTeamId)) ||
                                (c.SourcePerson.Role.RoleName == "Developer" && c.SourcePerson.ScrumTeamID == scrumTeamId && c.TargetPerson.Role.RoleName == "Stakeholder"))
                    .ToList();

                if (!communicationsBetweenStakeholdersDevelopers.Any())
                {
                    result.AddTest("Gatekeeping", "Developers are excluded from communication with Stakeholders.", false, SeverityLevel.Major);
                }
                else
                {
                    result.AddTest("Open Communication with Stakeholders", "Developers communicate freely with Stakeholders.", true, SeverityLevel.None);
                }
            }
        }

        private void EvaluateProductOwnerFailures(ScrumEvaluationResult result, int scrumTeamId)
        {
            var productGoalsNotByProductOwner = _context.ProductGoal
                .Where(pg => pg.ScrumTeamID == scrumTeamId && pg.CreatedByPerson.Role.RoleName != "Product Owner")
                .ToList();

            if (productGoalsNotByProductOwner.Any())
            {
                result.AddTest("Product Goals Not Created by Product Owner", "Some Product Goals were not created by the Product Owner.", false, SeverityLevel.Major);
            }
            else
            {
                result.AddTest("Product Goals Managed by Product Owner", "All Product Goals were created by the Product Owner.", true, SeverityLevel.None);
            }

            var backlogItemsWithoutPriority = _context.BacklogItem
                .Where(bi => _context.ProductBacklog.Any(pb => pb.ProductBacklogID == bi.ProductBacklogID &&
                                                               _context.ProductGoal.Any(pg => pg.ProductGoalID == pb.ProductGoalID &&
                                                               pg.CreatedByPerson.ScrumTeamID == scrumTeamId)) &&
                             bi.ItemPriority == null)
                .ToList();

            if (backlogItemsWithoutPriority.Any())
            {
                result.AddTest("Backlog Items Missing Priority", "Some Backlog Items do not have a priority assigned.", false, SeverityLevel.Major);
            }
            else
            {
                result.AddTest("Backlog Items Properly Prioritized", "All Backlog Items have a priority assigned.", true, SeverityLevel.None);
            }
        }

        private void EvaluateProductOwnerInadequacy(ScrumEvaluationResult result, int scrumTeamId)
        {
            var productOwnerRole = _context.ScrumRole.FirstOrDefault(r => r.RoleName == "Product Owner");

            if (productOwnerRole != null)
            {
                result.AddTest("Product Owner Role Present", "Product Owner role exists in the system.", true, SeverityLevel.None);

                var inadequateProcessSteps = _context.ProcessStep
                    .Where(ps => _context.Person.Any(p => p.PersonID == ps.GuidedByPersonID &&
                                                          p.RoleID == productOwnerRole.RoleID &&
                                                          p.ScrumTeamID == scrumTeamId))
                    .ToList();

                if (inadequateProcessSteps.Any())
                {
                    result.AddTest("Product Owner Guiding Process Steps", "Product Owner is guiding Process Steps, which is inadequate.", false, SeverityLevel.Minor);
                }
                else
                {
                    result.AddTest("Product Owner Not Guiding Process Steps", "Product Owner is not guiding Process Steps.", true, SeverityLevel.None);
                }
            }
            else
            {
                result.AddTest("Product Owner Role Missing", "No Product Owner role found in the system.", false, SeverityLevel.Critical);
            }
        }

        private void EvaluateTimeboxIssues(ScrumEvaluationResult result, int scrumTeamId)
        {
            var sprints = _context.Sprint
                .Where(s => _context.SprintGoal.Any(sg => sg.SprintGoalID == s.SprintGoalID && sg.CreatedByPerson.ScrumTeamID == scrumTeamId))
                .ToList();

            bool timeboxExceeded = false;
            bool timeboxMissing = false;

            foreach (var sprint in sprints)
            {
                var sprintDuration = sprint.EndDate - sprint.StartDate;

                if (sprint.TimeboxID != null)
                {
                    var timebox = _context.Timebox.FirstOrDefault(tb => tb.TimeboxID == sprint.TimeboxID);
                    if (timebox != null && sprintDuration.HasValue && sprintDuration.Value.TotalHours > timebox.Duration)
                    {
                        timeboxExceeded = true;
                    }
                }
                else
                {
                    timeboxMissing = true;
                }
            }

            if (timeboxExceeded)
            {
                result.AddTest("Sprint Timebox Exceeded", "One or more sprints exceeded their timebox.", false, SeverityLevel.Major);
            }
            else if (timeboxMissing)
            {
                result.AddTest("Sprint Timebox Missing", "One or more sprints are missing a timebox.", false, SeverityLevel.Major);
            }
            else
            {
                result.AddTest("Sprint Timebox Adhered", "All sprints are within their timebox.", true, SeverityLevel.None);
            }
        }

        private void EvaluateDeadlines(ScrumEvaluationResult result, int scrumTeamId)
        {
            // Check for deadlines in WorkItems related to the team
            var workItemsWithDeadline = _context.WorkItem
                .Where(w => _context.BacklogItem.Any(b => b.BacklogItemID == w.BacklogItemID &&
                                                          _context.ProductBacklog.Any(pb => pb.ProductBacklogID == b.ProductBacklogID &&
                                                          _context.ProductGoal.Any(pg => pg.ProductGoalID == pb.ProductGoalID &&
                                                          pg.CreatedByPerson.ScrumTeamID == scrumTeamId))) &&
                            w.Deadline != null)
                .ToList();

            if (workItemsWithDeadline.Any())
            {
                result.AddTest("Use of Deadlines - Work Item", "Some Work Items have deadline.", false, SeverityLevel.Major);
            }
            else
            {
                result.AddTest("Use of Deadlines - Work Item", "All Work Items don't have deadline.", true, SeverityLevel.None);
            }

            // Check for deadlines in Increments related to the team
            var incrementsWithDeadline = _context.Increment
                .Where(i => _context.Sprint.Any(s => s.SprintID == i.SprintID &&
                                                     _context.SprintGoal.Any(sg => sg.SprintGoalID == s.SprintGoalID &&
                                                     sg.CreatedByPerson.ScrumTeamID == scrumTeamId)) &&
                            i.Deadline != null)
                .ToList();

            if (incrementsWithDeadline.Any())
            {
                result.AddTest("Use of Deadlines - Increment", "Some increments have deadline.", false, SeverityLevel.Major);
            }
            else
            {
                result.AddTest("Use of Deadlines - Increment", "All increments don't have deadline.", true, SeverityLevel.None);
            }
        }

        private void EvaluateIncrementBinding(ScrumEvaluationResult result, int scrumTeamId)
        {
            var unboundIncrements = _context.Increment
                            .Where(i => _context.Sprint.Any(s => s.SprintID == i.SprintID &&
                                                                 _context.SprintGoal.Any(sg => sg.SprintGoalID == s.SprintGoalID &&
                                                                 sg.CreatedByPerson.ScrumTeamID == scrumTeamId)))
                            .ToList();

            if (unboundIncrements.Any())
            {
                result.AddTest("Incomplete Product Goals", "Some Product Goals are incomplete.", false, SeverityLevel.Major);
            }
            else
            {
                result.AddTest("Complete Product Goals", "All Product Goals are complete.", true, SeverityLevel.None);
            }
        }
    }
}
