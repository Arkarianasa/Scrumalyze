using Scrumalyze.Classes;
using Scrumalyze.Data;
using System.Diagnostics;
using Newtonsoft.Json;
using Scrumalyze.Dtos;
using Scrumalyze.Models;
using Microsoft.EntityFrameworkCore;
using Scrumalyze.Services;
using Newtonsoft.Json.Linq;
using Scrumalyze.Models.Scrumalyze.Classes;

namespace Scrumalyze.Services
{
    public class ScrumEvaluationService
    {
        private readonly ScrumalyzeContext _context;

        public ScrumEvaluationService(ScrumalyzeContext context)
        {
            _context = context;
        }

        /*
        public ScrumEvaluationResult? EvaluateScrumImplementation(int teamID)
        {
            // Get the Scrum team by team ID
            var team = _context.ScrumTeam.FirstOrDefault(t => t.ScrumTeamID == teamID);

            if (team == null)
                return null;

            var result = new ScrumEvaluationResult(teamID, team.TeamName);

            // Reuse existing methods to load related data.
            var persons = _teamService.GetPersonList(teamID).ToList();
            var productBacklog = _teamService.GetProductBacklog(teamID);
            var productGoals = _context.ProductGoal.Where(pg => pg.ScrumTeamID == teamID).ToList();
            var definitionsOfDone = _teamService.GetDoDList(teamID).ToList();
            var timeboxes = _teamService.GetTimeboxList(teamID).ToList();
            var workItems = _teamService.GetWorkItemList(teamID).ToList();
            var sprints = _teamService.GetSprintList(teamID).ToList();
            var increments = _teamService.GetIncrementList(teamID).ToList();

            // Assemble everything into an anonymous object.
            var teamData = new
            {
                ScrumTeam = team,
                Persons = persons,
                ProductBacklog = productBacklog,
                ProductGoals = productGoals,
                DefinitionsOfDone = definitionsOfDone,
                Timeboxes = timeboxes,
                WorkItems = workItems,
                Sprints = sprints,
                Increments = increments
            };

            // Directory where the Groovy scripts are stored
            string testDirectory = "Tests";

            //Console.WriteLine($"Working Directory: {Directory.GetCurrentDirectory()}");

            // Serialize the data to JSON.
            var jsonSettings = new JsonSerializerSettings
            {
                //ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                //PreserveReferencesHandling = PreserveReferencesHandling.Objects,
                Formatting = Formatting.Indented
            };

            string json = JsonConvert.SerializeObject(teamData, jsonSettings);
            string jsonFilePath = Path.Combine(Path.GetTempPath(), "teamData.json");
            File.WriteAllText(jsonFilePath, json);

            if (Directory.Exists(testDirectory))
            {
                var testFiles = Directory.GetFiles(testDirectory, "*.groovy");

                foreach (var testFile in testFiles)
                {
                    try
                    {
                        // Create the process to run Groovy
                        var process = new Process
                        {
                            StartInfo = new ProcessStartInfo
                            {
                                FileName = "C:\\Program Files\\Groovy\\bin\\groovy.bat",
                                Arguments = $"\"{testFile}\" \"{jsonFilePath}\"",
                                RedirectStandardOutput = true,
                                RedirectStandardError = true,
                                UseShellExecute = false,
                                CreateNoWindow = true
                            }
                        };

                        process.Start();

                        // Read the output
                        string output = process.StandardOutput.ReadToEnd();
                        string error = process.StandardError.ReadToEnd();

                        process.WaitForExit();

                        if (process.ExitCode == 0)
                        {
                            // Parse JSON or structured output from Groovy script
                            dynamic? testResult = Newtonsoft.Json.JsonConvert.DeserializeObject(output);

                            if (testResult != null)
                            {
                                bool passed = (bool)testResult.passed;
                                string name = (string)testResult.name;
                                string desc = (string)testResult.outcomeDescription;
                                string severity = (string)testResult.severity;

                                result.AddTest(
                                    name,
                                    desc,
                                    passed,
                                    Enum.Parse<SeverityLevel>(severity, true)
                                );
                            }
                            else
                            {
                                Console.WriteLine($"Failed to parse Groovy script output from file {testFile}: {output}");
                            }
                        }
                        else
                        {
                            Console.WriteLine($"Error in Groovy script {testFile}: {error}");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error running test from file {testFile}: {ex.Message}");
                    }
                }
            }
            else
            {
                Console.WriteLine($"Test directory '{testDirectory}' does not exist.");
            }

            return result;
        }
        */

        public ScrumEvaluation? GetLatestEvaluation(int teamID)
        {
            // Find the newest ScrumEvaluation row for that team
            return _context.ScrumEvaluation
                .Where(e => e.ScrumTeamID == teamID)
                .OrderByDescending(e => e.EvaluatedOn)
                .Include(e => e.Tests)
                .FirstOrDefault();
        }

        public ScrumEvaluation? EvaluateScrumImplementation(int teamID)
        {
            // 1) Load the Scrum Team
            var team = _context.ScrumTeam
                .Include(st => st.ScrumRoles)
                .Include(st => st.Persons).ThenInclude(p => p.Role)
                .Include(st => st.ProductGoals).ThenInclude(pg => pg.ResponsiblePerson)
                .Include(st => st.ProductBacklog).ThenInclude(pb => pb.BacklogItems)
                .Include(st => st.DefinitionsOfDone)
                .Include(st => st.Timeboxes)
                .Include(st => st.Sprints).ThenInclude(s => s.Timebox)
                .Include(st => st.Sprints).ThenInclude(s => s.SprintGoal)
                .Include(st => st.Sprints).ThenInclude(s => s.ProductGoal)
                .Include(st => st.Increments)
                .FirstOrDefault(t => t.ScrumTeamID == teamID);

            if (team == null)
                return null;

            // 2) Also load related WorkItems (if needed by Groovy scripts)
            var workItems = _context.WorkItem
                .Include(wi => wi.Persons)
                .Include(wi => wi.AcceptanceCriterias).ThenInclude(ac => ac.AcceptanceCriteria)
                .Include(wi => wi.DefinitionsOfDone).ThenInclude(dods => dods.DefinitionOfDone)
                .Include(wi => wi.WorkItemType)
                .Where(wi => wi.BacklogItem != null
                          && wi.BacklogItem.ProductBacklog != null
                          && wi.BacklogItem.ProductBacklog.ScrumTeamID == teamID)
                .ToList();

            // 3) Create a new ScrumEvaluation (parent)
            //    so we keep a record of this run (the "date for all tests")
            var newEvaluation = new ScrumEvaluation
            {
                ScrumTeam = _context.ScrumTeam.FirstOrDefault(t => t.ScrumTeamID == teamID),
                EvaluatedOn = DateTime.UtcNow,
                ScorePercentage = 0  // We'll compute later
            };
            _context.ScrumEvaluation.Add(newEvaluation);
            _context.SaveChanges(); // get the ID

            // 4) Build an object to pass to Groovy scripts
            var teamData = new
            {
                team,
                WorkItems = workItems
            };

            // 5) Serialize to JSON file
            var jsonSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
            string json = JsonConvert.SerializeObject(teamData, jsonSettings);
            string jsonFilePath = Path.Combine(Path.GetTempPath(), "teamData.json");
            File.WriteAllText(jsonFilePath, json);

            // Prepare to store test results in a local list, for computing final score
            var allTestResults = new List<ScrumEvaluationTest>();

            // 6) Run each Groovy script
            string testDirectory = "Tests";
            if (Directory.Exists(testDirectory))
            {
                var testFiles = Directory.GetFiles(testDirectory, "*.groovy");

                foreach (var testFile in testFiles)
                {
                    try
                    {
                        var process = new Process
                        {
                            StartInfo = new ProcessStartInfo
                            {
                                FileName = "C:\\Program Files\\Groovy\\bin\\groovy.bat",
                                Arguments = $"\"{testFile}\" \"{jsonFilePath}\"",
                                RedirectStandardOutput = true,
                                RedirectStandardError = true,
                                UseShellExecute = false,
                                CreateNoWindow = true
                            }
                        };

                        process.Start();
                        string output = process.StandardOutput.ReadToEnd();
                        string error = process.StandardError.ReadToEnd();
                        process.WaitForExit();

                        if (process.ExitCode == 0)
                        {
                            // Try parse the JSON from the script
                            var testResult = Newtonsoft.Json.Linq.JObject.Parse(output);
                            if (testResult != null)
                            {
                                bool passed = (bool)testResult["passed"];
                                string name = (string)testResult["name"];
                                string definition = (string)testResult["definition"];
                                string severity = passed ? "None" : (string)testResult["severity"];
                                string outcomeDescription = (string)testResult["outcomeDescription"];

                                // Arrays
                                var symptomsArray = testResult["symptoms"] as Newtonsoft.Json.Linq.JArray;
                                var rootCausesArray = testResult["possibleRootCauses"] as Newtonsoft.Json.Linq.JArray;

                                var symptoms = (symptomsArray != null)
                                    ? symptomsArray.ToObject<List<string>>()
                                    : new List<string>();

                                var rootCauses = (rootCausesArray != null)
                                    ? rootCausesArray.ToObject<List<string>>()
                                    : new List<string>();

                                // Build child entity
                                var childTest = new ScrumEvaluationTest
                                {
                                    ScrumEvaluationID = newEvaluation.ScrumEvaluationID,
                                    ScrumEvaluation = newEvaluation,
                                    Name = name,
                                    Definition = definition,
                                    Severity = severity,
                                    Passed = passed,
                                    OutcomeDescription = outcomeDescription,
                                    Symptoms = symptoms,
                                    PossibleRootCauses = rootCauses
                                };

                                // Insert into DB
                                _context.ScrumEvaluationTest.Add(childTest);
                                _context.SaveChanges();

                                // Keep in memory list to compute final score
                                allTestResults.Add(childTest);
                            }
                            else
                            {
                                Console.WriteLine($"Failed to parse output from {testFile}:\n{output}");
                            }
                        }
                        else
                        {
                            Console.WriteLine($"Error in Groovy script {testFile}:\n{error}");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error running test from file {testFile}: {ex.Message}");
                    }
                }
            }
            else
            {
                Console.WriteLine($"Test directory '{testDirectory}' does not exist.");
            }

            // 7) Compute final ScorePercentage from how many tests passed
            if (allTestResults.Count > 0)
            {
                int passedCount = allTestResults.Count(tr => tr.Passed);
                int percentage = (passedCount * 100) / allTestResults.Count;
                newEvaluation.ScorePercentage = percentage;
            }
            else
            {
                newEvaluation.ScorePercentage = 0;
            }

            // Update DB with final score
            _context.SaveChanges();

            // 8) Return the new parent record with final data
            return newEvaluation;
        }



        /*
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
            EvaluateProductGoal(result, team.ScrumTeamID);
            EvaluateProductOwnerInadequacy(result, team.ScrumTeamID);
            EvaluateProductOwnerPresence(result, team.ScrumTeamID);
            EvaluateScrumMasterPresence(result, team.ScrumTeamID);
            EvaluateTimeboxIssues(result, team.ScrumTeamID);
            EvaluateUseOfDeadlines(result, team.ScrumTeamID);
            EvaluateIncrementBinding(result, team.ScrumTeamID);
            

            return result;
        }
        */
        /*
        private void EvaluateDefinitionOfDone(ScrumEvaluationResult result, int scrumTeamId)
        {
            var workItemsWithoutDoD = _context.WorkItem
                .Where(w => !_context.WorkItem_DefinitionOfDone.Any(wdd => wdd.WorkItemID == w.WorkItemID &&
                                                                          _context.DefinitionOfDone.Any(dod => dod.DefinitionOfDoneID == wdd.DefinitionOfDoneID &&
                                                                                                                dod.ScrumTeamID == scrumTeamId)))
                .ToList();

            if (workItemsWithoutDoD.Any())
            {
                result.AddTest("Definition of Done Absence", "Some work items are missing a Definition of Done.", false, SeverityLevel.Major);
            }
            else
            {
                result.AddTest("Definition of Done Absence", "All work items have a Definition of Done.", true, SeverityLevel.None);
            }

            var workItemsWithNonPolicyDoD = _context.WorkItem
                    .Where(w => _context.WorkItem_DefinitionOfDone.Any(wdd => wdd.WorkItemID == w.WorkItemID &&
                                                                              _context.DefinitionOfDone.Any(dod => dod.DefinitionOfDoneID == wdd.DefinitionOfDoneID &&
                                                                                                                    dod.ScrumTeamID == scrumTeamId &&
                                                                                                                    !dod.IsCompanyPolicy)))
                    .ToList();

            if (workItemsWithNonPolicyDoD.Any())
            {
                result.AddTest("Non-Policy Definition of Done Usage", "Some work items are using a Definition of Done that is not marked as a company policy.", false, SeverityLevel.Minor);
            }
            else
            {
                result.AddTest("Non-Policy Definition of Done Usage", "All work items are using Definitions of Done that comply with company policies.", true, SeverityLevel.None);
            }
        }

        private void EvaluateAcceptanceCriteria(ScrumEvaluationResult result, int scrumTeamId)
        {
            var workItemsWithoutAC = _context.WorkItem
                .Where(w => !_context.WorkItem_AcceptanceCriteria.Any(wac => wac.WorkItemID == w.WorkItemID &&
                                                                             _context.AcceptanceCriteria.Any(ac => ac.AcceptanceCriteriaID == wac.AcceptanceCriteriaID &&
                                                                                                                   ac.ScrumTeamID == scrumTeamId)))
                .ToList();

            if (workItemsWithoutAC.Any())
            {
                result.AddTest("Acceptance Criteria Absence", "Some work items are missing Acceptance Criteria.", false, SeverityLevel.Major);
            }
            else
            {
                result.AddTest("Acceptance Criteria Absence", "All work items have Acceptance Criteria.", true, SeverityLevel.None);
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
                result.AddTest("Gatekeeping", "No communication between Stakeholders and Scrum team members.", false, SeverityLevel.Critical);
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
                    result.AddTest("Gatekeeping", "Developers communicate freely with Stakeholders.", true, SeverityLevel.None);
                }
            }
        }

        private void EvaluateProductGoal(ScrumEvaluationResult result, int scrumTeamId)
        {
            var productGoals = _context.ProductGoal
                .Where(pg => pg.ScrumTeamID == scrumTeamId)
                .ToList();

            if (productGoals.Count > 1)
                result.AddTest("Product Goal Count", "There is more than one Product Goal for the Scrum Team.", false, SeverityLevel.Minor);
            else
                result.AddTest("Product Goal Count", "There is only one Product Goal for the Scrum Team.", true, SeverityLevel.None);

            var productGoalsWithoutResponsiblePerson = productGoals
                .Where(pg => pg.ResponsiblePerson == null)
                .ToList();

            if (productGoalsWithoutResponsiblePerson.Any())
                result.AddTest("Product Goal responsibility", "Product Goal do not have a responsible person assigned.", false, SeverityLevel.Critical);
            else
            {
                var productGoalsNotByProductOwner = productGoals
                    .Where(pg => pg.ResponsiblePerson != null && pg.ResponsiblePerson.Role.RoleName != "Product Owner")
                    .ToList();

                if (productGoalsNotByProductOwner.Any())
                    result.AddTest("Product Goal responsibility", "Product Owner is not responsible for Product Goal.", false, SeverityLevel.Critical);
                else
                    result.AddTest("Product Goal responsibility", "Product Owner is responsible for Product Goal.", true, SeverityLevel.None);
            }


            var backlogItemsWithoutPriority = _context.BacklogItem
                .Where(bi => _context.ProductBacklog.Any(pb => pb.ProductBacklogID == bi.ProductBacklogID &&
                                                               _context.ProductGoal.Any(pg => pg.ProductGoalID == pb.ProductGoalID &&
                                                               pg.ScrumTeamID == scrumTeamId)) &&
                             bi.PrimaryPriorityValue == null)
                .ToList();

            if (backlogItemsWithoutPriority.Any())
                result.AddTest("Product Backlog Prioritization", "Some Backlog Items do not have a priority assigned.", false, SeverityLevel.Major);
            else
                result.AddTest("Product Backlog Prioritization", "All Backlog Items have a priority assigned.", true, SeverityLevel.None);
        }

        private void EvaluateProductOwnerInadequacy(ScrumEvaluationResult result, int scrumTeamId)
        {
            var productOwnerRoles = _context.Person
                    .Where(p => p.Role.RoleName == "Product Owner" && p.ScrumTeamID == scrumTeamId)
                    .Select(po => po.PersonID)
                    .ToList();

            if (productOwnerRoles.Any())
            {
                var inadequateProcessSteps = _context.ProcessStep
                                    .Where(ps => ps.GuidedByPersonID != null && productOwnerRoles.Contains(ps.GuidedByPersonID.Value))
                                    .ToList();

                if (inadequateProcessSteps.Any())
                {
                    result.AddTest("Product Owner Adequacy", "Product Owner is guiding Process Steps, which is inadequate.", false, SeverityLevel.Major);
                }
                else
                {
                    result.AddTest("Product Owner Adequacy", "Product Owner work is adequate.", true, SeverityLevel.None);
                }
            }
        }

        private void EvaluateProductOwnerPresence(ScrumEvaluationResult result, int scrumTeamId)
        {
            var scrumProductOwnerCount = _context.ScrumRole.Count(r => r.RoleName == "Product Owner");

            if (scrumProductOwnerCount > 0)
            {
                if (scrumProductOwnerCount > 1)
                {
                    result.AddTest("Presence of the Product Owner", "More than one Product Owner found in the team.", false, SeverityLevel.Major);
                }
                result.AddTest("Presence of the Product Owner", "Product Owner role exists in the system.", true, SeverityLevel.None);
            }
            else
            {
                result.AddTest("Presence of the Product Owner", "Product Owner role found in the system.", false, SeverityLevel.Critical);
            }
        }

        private void EvaluateScrumMasterPresence(ScrumEvaluationResult result, int scrumTeamId)
        {
            var scrumMasterRoleCount = _context.ScrumRole.Count(r => r.RoleName == "Scrum Master");

            if (scrumMasterRoleCount > 0)
            {
                if (scrumMasterRoleCount > 1)
                {
                    result.AddTest("Presence of the Scrum Master", "More than one Scrum Master found in the team.", false, SeverityLevel.Major);
                }
                result.AddTest("Presence of the Scrum Master", "Scrum Master role exists in the system.", true, SeverityLevel.None);
            }
            else
            {
                result.AddTest("Presence of the Scrum Master", "Scrum Master role found in the system.", false, SeverityLevel.Critical);
            }
        }

        private void EvaluateTimeboxIssues(ScrumEvaluationResult result, int scrumTeamId)
        {
            var sprints = _context.Sprint
                .Where(s => _context.ProductGoal.Any(pg => pg.ScrumTeamID == scrumTeamId))
                .ToList();

            var workDayHours = _context.ScrumTeam.Where(s => s.ScrumTeamID == scrumTeamId).Select(s => s.WorkDayHours).FirstOrDefault();


            bool timeboxExceeded = false;
            bool timeboxMissing = false;

            foreach (var sprint in sprints)
            {
                if (timeboxExceeded && timeboxMissing) break;
                if (sprint.EndDate == null) continue;

                var sprintDuration = sprint.EndDate.Value - sprint.StartDate;

                // Calculate working hours
                int workingDays = 0;
                for (var date = sprint.StartDate; date <= sprint.EndDate.Value; date = date.AddDays(1))
                {
                    if (date.DayOfWeek != DayOfWeek.Saturday && date.DayOfWeek != DayOfWeek.Sunday)
                        workingDays++;
                }
                double totalWorkingHours = workingDays * workDayHours;

                if (sprint.TimeboxID != null)
                {
                    var timebox = _context.Timebox.FirstOrDefault(tb => tb.TimeboxID == sprint.TimeboxID);
                    if (timebox != null && totalWorkingHours > timebox.Duration)
                        timeboxExceeded = true;
                }
                else
                    timeboxMissing = true;
            }

            if (timeboxMissing)
                result.AddTest("Sprint Timebox Presence", "One or more sprints are missing a timebox.", false, SeverityLevel.Major);
            else
                result.AddTest("Sprint Timebox Presence", "Every sprint has a timebox.", true, SeverityLevel.None);

            if (timeboxExceeded)
                result.AddTest("Sprint Timebox", "Some sprints exceeded their timebox.", false, SeverityLevel.Major);
            else
                result.AddTest("Sprint Timebox", "All sprints are within their timebox.", true, SeverityLevel.None);
        }

        private void EvaluateUseOfDeadlines(ScrumEvaluationResult result, int scrumTeamId)
        {
            // Check for deadlines in WorkItems related to the team
            var workItemsWithDeadline = _context.WorkItem
                .Where(w => _context.BacklogItem.Any(b => b.BacklogItemID == w.BacklogItemID &&
                                                          _context.ProductBacklog.Any(pb => pb.ProductBacklogID == b.ProductBacklogID &&
                                                          _context.ProductGoal.Any(pg => pg.ProductGoalID == pb.ProductGoalID &&
                                                          pg.ScrumTeamID == scrumTeamId))) &&
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
        }

        private void EvaluateIncrementBinding(ScrumEvaluationResult result, int scrumTeamId)
        {
            var increments = _context.Increment
                .Where(i => i.ScrumTeamID == scrumTeamId)
                .ToList();

            if (increments.Any())
            {
                // Test
                var incrementsWithoutSprint = increments.Where(i => i.SprintID == null).ToList();

                if (incrementsWithoutSprint.Any())
                    result.AddTest("Increment Sprint Binding", "Some increments do not have an associated sprint.", false, SeverityLevel.Major);
                else
                    result.AddTest("Increment Sprint Binding", "All increments does have an associated sprint.", true, SeverityLevel.None);

                // Test
                var incrementsWithoutProductGoal = increments.Where(i => i.ProductGoalID == null).ToList();

                if (incrementsWithoutProductGoal.Any())
                    result.AddTest("Increment Product Goal Binding", "Some increments do not have an associated product goal.", false, SeverityLevel.Major);
                else
                    result.AddTest("Increment Product Goal Binding", "All increments does have an associated product goal.", true, SeverityLevel.None);

                // Test
                var incrementsWithoutResponsiblePerson = increments.Where(i => i.ReceivedByID == null).ToList();

                if (incrementsWithoutResponsiblePerson.Any())
                    result.AddTest("Increment Receiver", "Some increments are not received by anybody.", false, SeverityLevel.Critical);
                else
                {
                    bool receivedByStakeholders = true;
                    // If there is a responsible person, check if that person is a Stakeholder
                    foreach (var increment in increments.Where(i => i.ReceivedByID != null))
                    {
                        // TODO
                        var person = _context.Person.FirstOrDefault(p => p.PersonID == increment.ReceivedByID);

                        if (person != null)
                        {
                            receivedByStakeholders = person.Role.RoleName == "Stakeholder";

                            if (receivedByStakeholders)
                                break;
                        }
                        
                    }

                    if (receivedByStakeholders)
                        result.AddTest("Increment Receiver", "Some increments are not received by Stakeholder.", false, SeverityLevel.Minor);
                    else
                        result.AddTest("Increment Receiver", "All increments are received by Stakeholder.", true, SeverityLevel.None);
                }

            }
        }
        */
    }
}
