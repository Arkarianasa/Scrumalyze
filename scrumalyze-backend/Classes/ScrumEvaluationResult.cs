using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Classes
{
    public class ScrumEvaluationResult
    {
        public List<string> PathologicalBehaviors { get; set; } = new List<string>();
        public string TeamName { get; set; }
        public int ScorePercentage { get; private set; } = 0;
        public int Total { get; set; } = 0;
        public int Count { get; set; } = 0;

        public ScrumEvaluationResult(string name)
        {
            TeamName = name;
        }

        public int IncreaseScore()
        {
            Total++;
            Count++;

            CalculateScore();

            return ScorePercentage;
        }
        public int DecreaseScore()
        {
            Total++;

            CalculateScore();

            return ScorePercentage;
        }

        private int CalculateScore()
        {
            ScorePercentage = (Count * 200 + Total) / (Total * 2);

            return ScorePercentage;
        }

        public void NullResult()
        {
            ScorePercentage = 0;
            Total = 0;
            Count = 0;
            PathologicalBehaviors.Clear();
        }

        public string PrettyPrint()
        {
            var result = new StringBuilder();

            result.AppendLine($"===== Scrum Team {TeamName} Evaluation Report =====");
            result.AppendLine($"Score Percentage: {ScorePercentage}%");
            result.AppendLine($"Total Evaluated: {Total}");
            result.AppendLine($"Success Count: {Count}");
            result.AppendLine("-----------------------------------------------");

            if (PathologicalBehaviors.Count > 0)
            {
                result.AppendLine("Detected Pathological Behavior Markers:");
                for (int i = 0; i < PathologicalBehaviors.Count; i++)
                {
                    result.AppendLine($"{i + 1}. {PathologicalBehaviors[i]}");
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
