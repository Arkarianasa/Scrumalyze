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

        public ScrumEvaluation? GetLatestEvaluation(int teamID)
        {
            // Find the newest ScrumEvaluation row for that team
            return _context.ScrumEvaluation
                .Where(e => e.ScrumTeamID == teamID)
                .OrderByDescending(e => e.EvaluatedOn)
                .Include(e => e.Tests)
                .ThenInclude(t => t.ScrumEvaluationTestCategory)
                .FirstOrDefault();
        }

        public ScrumEvaluation? EvaluateScrumImplementation(int teamID)
        {
            // Load the Scrum Team
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
                .Include(st => st.Sprints).ThenInclude(s => s.SprintBacklogs).ThenInclude(sb => sb.BacklogItems)
                .Include(st => st.Sprints).ThenInclude(s => s.SprintBacklogs).ThenInclude(sb => sb.ResponsiblePerson)
                .Include(st => st.Increments)
                .Include(st => st.ProcessSteps).ThenInclude(ps => ps.ProcessStepType)
                .FirstOrDefault(t => t.ScrumTeamID == teamID);

            if (team == null)
                return null;

            // Load WorkItems Data
            var workItems = _context.WorkItem
                .Include(wi => wi.Persons).ThenInclude(pw => pw.Person).ThenInclude(p => p.Role)
                .Include(wi => wi.AcceptanceCriterias).ThenInclude(ac => ac.AcceptanceCriteria)
                .Include(wi => wi.DefinitionsOfDone).ThenInclude(dods => dods.DefinitionOfDone)
                .Include(wi => wi.WorkItemType)
                .Where(wi => wi.BacklogItem != null
                          && wi.BacklogItem.ProductBacklog != null
                          && wi.BacklogItem.ProductBacklog.ScrumTeamID == teamID)
                .ToList();

            // Load Communication Data
            var communication = _context.Communication
                .Include(c => c.SourcePerson).ThenInclude(p => p.Role)
                .Include(c => c.TargetPerson).ThenInclude(p => p.Role)
                .Where(c => team.Persons.Select(p => p.PersonID).Contains(c.SourcePersonID)
                         && team.Persons.Select(p => p.PersonID).Contains(c.TargetPersonID))
                .ToList();

            // Create a new ScrumEvaluation
            var newEvaluation = new ScrumEvaluation
            {
                ScrumTeam = _context.ScrumTeam.FirstOrDefault(t => t.ScrumTeamID == teamID),
                EvaluatedOn = DateTime.UtcNow,
                ScorePercentage = 0  // We'll compute later
            };
            _context.ScrumEvaluation.Add(newEvaluation);
            _context.SaveChanges(); // get the ID

            // Build an object to pass to Groovy scripts
            var teamData = new
            {
                team,
                WorkItems = workItems,
                Communication = communication,
            };

            // Serialize to JSON file
            var jsonSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
            string json = JsonConvert.SerializeObject(teamData, jsonSettings);
            string jsonFilePath = Path.Combine(Path.GetTempPath(), "teamData.json");
            File.WriteAllText(jsonFilePath, json);

            var allTestResults = new List<ScrumEvaluationTest>();

            // Run each Groovy script
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
                                int categoryID = (int)testResult["categoryID"];
                                string definition = (string)testResult["definition"];
                                string severity = passed ? "None" : (string)testResult["severity"];
                                string outcomeDescription = (string)testResult["outcomeDescription"];

                                var category = _context.ScrumEvaluationTestCategory.First(c => c.ScrumEvaluationTestCategoryID == categoryID);

                                // Arrays
                                var symptomsArray = testResult["symptoms"] as Newtonsoft.Json.Linq.JArray;
                                var rootCausesArray = testResult["possibleRootCauses"] as Newtonsoft.Json.Linq.JArray;
                                var consequencesArray = testResult["possibleConsequences"] as Newtonsoft.Json.Linq.JArray;

                                var symptoms = (symptomsArray != null)
                                    ? symptomsArray.ToObject<List<string>>()
                                    : new List<string>();

                                var rootCauses = (rootCausesArray != null)
                                    ? rootCausesArray.ToObject<List<string>>()
                                    : new List<string>();

                                var consequences = (consequencesArray != null)
                                    ? consequencesArray.ToObject<List<string>>()
                                    : new List<string>();

                                // Build child entity
                                var childTest = new ScrumEvaluationTest
                                {
                                    ScrumEvaluationID = newEvaluation.ScrumEvaluationID,
                                    ScrumEvaluationTestCategoryID = categoryID,
                                    ScrumEvaluationTestCategory = category,
                                    ScrumEvaluation = newEvaluation,
                                    Name = name,
                                    Definition = definition,
                                    Severity = severity,
                                    Passed = passed,
                                    OutcomeDescription = outcomeDescription,
                                    Symptoms = symptoms,
                                    PossibleRootCauses = rootCauses,
                                    PossibleConsequences = consequences
                                };

                                // Insert into DB
                                _context.ScrumEvaluationTest.Add(childTest);
                                _context.SaveChanges();

                                // Keep in memory list of tests
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

            // Compute final ScorePercentage from how many tests passed
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

            // Return the new parent record with final data
            return newEvaluation;
        }
    }
}
