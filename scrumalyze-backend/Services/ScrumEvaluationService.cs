using Microsoft.EntityFrameworkCore;
using Scrumalyze.Classes;
using Scrumalyze.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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

        public ScrumEvaluationResult EvaluateScrumImplementation(int teamID)
        {
            var result = new ScrumEvaluationResult(teamID);

            // Get the Scrum team by team name
            var team = _context.ScrumTeam.FirstOrDefault(t => t.ScrumTeamID == teamID);

            if (team == null)
            {
                result.PathologicalBehaviors.Add($"Team '{teamID}' not found.");
                return result;
            }

            result.AddName(team.TeamName);

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
            // Filter work items by Scrum team using the BacklogItem's relationship to the team
            var workItemsWithoutDoD = _context.WorkItem
                .Where(w => w.BacklogItemID != null &&  // Keep this check only if BacklogItemID is nullable
                            _context.BacklogItem.Any(b => b.BacklogItemID == w.BacklogItemID &&
                                                          _context.ProductBacklog.Any(pb => pb.ProductBacklogID == b.ProductBacklogID &&
                                                          _context.ProductGoal.Any(pg => pg.ProductGoalID == pb.ProductGoalID &&
                                                          pg.CreatedByPerson.ScrumTeamID == scrumTeamId))) &&
                            w.DefinitionOfDoneID == null)
                .ToList();


            if (workItemsWithoutDoD.Any())
            {
                result.DecreaseScore();
                result.PathologicalBehaviors.Add("Absence of Definition of Done in some work items.");
            }
            else
            {
                result.IncreaseScore();
            }
        }

        private void EvaluateAcceptanceCriteria(ScrumEvaluationResult result, int scrumTeamId)
        {
            // Filter work items by Scrum team using the BacklogItem's relationship to the team
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
                result.DecreaseScore();
                result.PathologicalBehaviors.Add("Absence of Acceptance Criteria probably because of interchanging Acceptance Criteria and DoD.");
            }
            else
            {
                result.IncreaseScore();
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
                result.DecreaseScore();
                result.PathologicalBehaviors.Add("No communication between Stakeholders and any Scrum team members.");
            }
            else
            {
                var communicationsBetweenStakeholdersDevelopers = _context.Communication
                    .Where(c => (c.SourcePerson.Role.RoleName == "Stakeholder" && ( c.TargetPerson.Role.RoleName == "Developer" && c.SourcePerson.ScrumTeamID == scrumTeamId)) ||
                                (c.SourcePerson.Role.RoleName == "Developer" && c.SourcePerson.ScrumTeamID == scrumTeamId) && c.TargetPerson.Role.RoleName == "Stakeholder")
                .ToList();

                if (!communicationsBetweenStakeholdersDevelopers.Any())
                {
                    result.DecreaseScore();
                    result.PathologicalBehaviors.Add("Gatekeeping - Developers are excluded from communication with Stakeholders.");
                }
                else
                {
                    result.IncreaseScore();
                }
            }
        }


        private void EvaluateProductOwnerFailures(ScrumEvaluationResult result, int scrumTeamId)
        {
            // Check if Product Goals are created by the Product Owner in the given team
            var productGoalsNotByProductOwner = _context.ProductGoal
                .Where(pg => pg.ScrumTeamID == scrumTeamId &&
                             pg.CreatedByPerson.Role.RoleName != "Product Owner")
                .ToList();

            if (productGoalsNotByProductOwner.Any())
            {
                result.DecreaseScore();
                result.PathologicalBehaviors.Add("Failure of the Product Owner role - Product Goal not created by Product Owner.");
            } else
            {
                result.IncreaseScore();
            }

            // Check if BacklogItems for the team are missing priority
            var backlogItemsWithoutPriority = _context.BacklogItem
                .Where(bi => _context.ProductBacklog.Any(pb => pb.ProductBacklogID == bi.ProductBacklogID &&
                                                               _context.ProductGoal.Any(pg => pg.ProductGoalID == pb.ProductGoalID &&
                                                               pg.CreatedByPerson.ScrumTeamID == scrumTeamId)) &&
                             bi.ItemPriority == null)
                .ToList();

            if (backlogItemsWithoutPriority.Any())
            {
                result.DecreaseScore();
                result.PathologicalBehaviors.Add("Failure of the Product Owner role - Backlog Items without priority.");
            } else
            {
                result.IncreaseScore();
            }
        }


        private void EvaluateProductOwnerInadequacy(ScrumEvaluationResult result, int scrumTeamId)
        {
            var productOwnerRole = _context.ScrumRole.FirstOrDefault(r => r.RoleName == "Product Owner");

            if (productOwnerRole != null)
            {
                // Product Owner role found in the system
                result.IncreaseScore();

                // Check if the Product Owner is guiding Process Steps in the given team
                var inadequateProcessSteps = _context.ProcessStep
                    .Where(ps => _context.Person.Any(p => p.PersonID == ps.GuidedByPersonID &&
                                                          p.RoleID == productOwnerRole.RoleID &&
                                                          p.ScrumTeamID == scrumTeamId))
                    .ToList();

                if (inadequateProcessSteps.Any())
                {
                    result.DecreaseScore();
                    result.PathologicalBehaviors.Add("Product Owner is guiding Process Steps, which is inadequate.");
                } else
                {
                    result.IncreaseScore();
                }

                // Check if Product Owner is assigned to work items in the given team
                var productOwnerWorkItems = _context.WorkItem
                    .Where(wi => _context.Person.Any(p => p.PersonID == wi.AcceptanceCriteriaID &&
                                                          p.RoleID == productOwnerRole.RoleID &&
                                                          p.ScrumTeamID == scrumTeamId))
                    .ToList();

                if (productOwnerWorkItems.Any())
                {
                    result.DecreaseScore();
                    result.PathologicalBehaviors.Add("Product Owner is assigned to some Work Items, which is inadequate.");
                } else
                {
                    result.IncreaseScore();
                }
            }
            else
            {
                result.DecreaseScore();
                result.PathologicalBehaviors.Add("No Product Owner role found in the system.");
            }
        }


        private void EvaluateTimeboxIssues(ScrumEvaluationResult result, int scrumTeamId)
        {
            // Check for timebox issues in Sprints related to the team
            var sprints = _context.Sprint
                .Where(s => _context.SprintGoal.Any(sg => sg.SprintGoalID == s.SprintGoalID && sg.CreatedByPerson.ScrumTeamID == scrumTeamId))
                .ToList();

            bool decreaseScoreExceedsSprint = false;
            bool decreaseScoreTimeboxMissingSprint = false;

            foreach (var sprint in sprints)
            {
                var sprintDuration = sprint.EndDate - sprint.StartDate;

                if (sprint.TimeboxID != null)
                {
                    var timebox = _context.Timebox.FirstOrDefault(tb => tb.TimeboxID == sprint.TimeboxID);
                    if (timebox != null && sprintDuration.HasValue && sprintDuration.Value.TotalHours > timebox.Duration)
                    {
                        decreaseScoreExceedsSprint = true;
                        result.PathologicalBehaviors.Add("Sprint duration exceeds the specified Timebox.");
                    }
                }
                else
                {
                    decreaseScoreTimeboxMissingSprint = true;
                    result.PathologicalBehaviors.Add("Sprint does not have a Timebox assigned.");
                }
            }

            if (decreaseScoreExceedsSprint)
            {
                result.DecreaseScore();
            }
            else
            {
                result.IncreaseScore();
            }

            if (decreaseScoreTimeboxMissingSprint)
            {
                result.DecreaseScore();
            }
            else
            {
                result.IncreaseScore();
            }

            // Check for timebox issues in ProcessSteps related to the team
            var processSteps = _context.ProcessStep
                .Where(ps => _context.Sprint.Any(s => s.SprintID == ps.SprintID &&
                                                      _context.SprintGoal.Any(sg => sg.SprintGoalID == s.SprintGoalID &&
                                                      sg.CreatedByPerson.ScrumTeamID == scrumTeamId)))
                .ToList();

            bool decreaseScoreExceeds = false;
            bool decreaseScoreTimeboxMissing = false;

            foreach (var processStep in processSteps)
            {
                var processStepDuration = processStep.EndDate - processStep.StartDate;

                if (processStep.TimeboxID != null)
                {
                    var timebox = _context.Timebox.FirstOrDefault(tb => tb.TimeboxID == processStep.TimeboxID);
                    if (timebox != null && processStepDuration.HasValue)
                    {
                        // Calculate the duration in hours
                        var actualDuration = processStepDuration.Value.TotalHours;
                        var allowedDuration = timebox.Duration;

                        // Check if the actual duration exceeds the allowed Timebox duration
                        if (actualDuration > allowedDuration)
                        {
                            // Calculate the exceeded percentage
                            var exceededPercentage = ((actualDuration - allowedDuration) / allowedDuration) * 100;

                            decreaseScoreExceeds = true;
                            result.PathologicalBehaviors.Add($"ProcessStep {processStep.ProcessStepName} duration exceeds the specified Timebox by {exceededPercentage:F2}%.");
                        }
                    }
                }
                else
                {
                    decreaseScoreTimeboxMissing = true;
                    result.PathologicalBehaviors.Add("ProcessStep does not have a Timebox assigned.");
                }
            }

            if (decreaseScoreExceeds)
            {
                result.DecreaseScore();
            }
            else
            {
                result.IncreaseScore();
            }

            if (decreaseScoreTimeboxMissing)
            {
                result.DecreaseScore();
            }
            else
            {
                result.IncreaseScore();
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
                result.DecreaseScore();
                result.PathologicalBehaviors.Add("Use of Deadlines - WorkItem has a deadline.");
            } else
            {
                result.IncreaseScore();
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
                result.DecreaseScore();
                result.PathologicalBehaviors.Add("Use of Deadlines - Increment has a deadline.");
            } else
            {
                result.IncreaseScore();
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
                result.DecreaseScore();
                result.PathologicalBehaviors.Add("Increments are not properly bound to a Sprint.");
            }
            else
            {
                result.IncreaseScore();
            }
        }

    }

}
