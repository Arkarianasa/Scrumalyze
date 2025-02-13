using Scrumalyze.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Classes
{
    public enum SeverityLevel
    {
        None,      // For passing tests
        Minor,
        Major,
        Critical
    }

    public class Test
    {
        public string Name { get; set; }
        public string Details { get; set; }
        public bool Passed { get; set; }
        public SeverityLevel SeverityLevel { get; set; }

        public Test(string description, string details, bool passed, SeverityLevel severityLevel)
        {
            Name = description;
            Details = details;
            Passed = passed;
            SeverityLevel = severityLevel;
        }
    }

    public class ScrumEvaluationResult
    {
        public int TeamID { get; set; }
        public string TeamName { get; set; }
        public List<Test> Tests { get; set; } = [];
        public int ScorePercentage { get; set; }

        public ScrumEvaluationResult(int teamID, string name)
        {
            TeamID = teamID;
            TeamName = name;
        }

        public bool AddTest(string description, string details, bool passed, SeverityLevel severityLevel)
        {
            if (Tests.Any(test => test.Name == description))
            {
                return false;
            }

            Tests.Add(new Test(description, details, passed, severityLevel));
            CalculateScore();
            return true;
        }

        // Calculate score based on passed tests
        public int CalculateScore()
        {
            if (Tests.Count == 0) return 0;

            int passedTests = Tests.Count(test => test.Passed);
            ScorePercentage = (passedTests * 100) / Tests.Count;

            return ScorePercentage;
        }

        public void NullResult()
        {
            ScorePercentage = 0;
            Tests = [];
        }

        public string PrettyPrint()
        {
            var result = new StringBuilder();

            result.AppendLine($"===== Scrum Team {TeamName} (ID {TeamID}) Evaluation Report =====");
            result.AppendLine($"Score Percentage: {ScorePercentage}%");
            result.AppendLine($"Total Evaluated: {Tests.Count}");
            result.AppendLine($"Success Count: {Tests.Count(t => t.Passed)}");
            result.AppendLine("-----------------------------------------------");

            if (Tests.Count > 0)
            {
                result.AppendLine("Detected Pathological Behavior Markers:");
                for (int i = 0; i < Tests.Count; i++)
                {
                    if (!Tests[i].Passed)
                    {
                        result.AppendLine($"{i + 1}. {Tests[i].Name}, {Tests[i].Details} - Severity: {Tests[i].SeverityLevel}");
                    }
                }
            }
            else
            {
                result.AppendLine("No Pathological Behaviors detected.");
            }

            result.AppendLine("===============================================");

            Console.WriteLine(result);
            return result.ToString();
        }
    }
}

