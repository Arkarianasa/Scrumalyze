namespace Scrumalyze.Models
{
    using Newtonsoft.Json;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace Scrumalyze.Classes
    {
        public class ScrumEvaluationTest
        {
            public int ScrumEvaluationTestID { get; set; }

            // Foreign key to the parent "ScrumEvaluation"
            public int ScrumEvaluationID { get; set; }

            // Fields from Groovy
            public string Name { get; set; } = string.Empty;
            public string Definition { get; set; } = string.Empty;
            public string Severity { get; set; } = string.Empty;
            public bool Passed { get; set; }
            public string OutcomeDescription { get; set; } = string.Empty;

            // JSON-stored arrays
            public string SymptomsJson { get; set; } = string.Empty;
            public string PossibleRootCausesJson { get; set; } = string.Empty;

            [JsonIgnore]
            public required ScrumEvaluation ScrumEvaluation { get; set; }

            // Optional convenience
            [NotMapped]
            public List<string> Symptoms
            {
                get
                {
                    if (string.IsNullOrEmpty(SymptomsJson))
                        return new List<string>();
                    return Newtonsoft.Json.JsonConvert.DeserializeObject<List<string>>(SymptomsJson);
                }
                set
                {
                    SymptomsJson = Newtonsoft.Json.JsonConvert.SerializeObject(value);
                }
            }

            [NotMapped]
            public List<string> PossibleRootCauses
            {
                get
                {
                    if (string.IsNullOrEmpty(PossibleRootCausesJson))
                        return new List<string>();
                    return Newtonsoft.Json.JsonConvert.DeserializeObject<List<string>>(PossibleRootCausesJson);
                }
                set
                {
                    PossibleRootCausesJson = Newtonsoft.Json.JsonConvert.SerializeObject(value);
                }
            }
        }
    }

}
