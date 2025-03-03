namespace Scrumalyze.Models
{
    using Newtonsoft.Json;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace Scrumalyze.Classes
    {
        public class ScrumEvaluation
        {
            public int ScrumEvaluationID { get; set; }

            public int ScrumTeamID { get; set; }

            public DateTime EvaluatedOn { get; set; } = DateTime.UtcNow;

            public int ScorePercentage { get; set; }

            // Navigation property to the child tests
            public ICollection<ScrumEvaluationTest> Tests { get; set; } = new List<ScrumEvaluationTest>();

            [JsonIgnore] // Prevent circular reference
            public required ScrumTeam ScrumTeam { get; set; }
        }
    }

}
