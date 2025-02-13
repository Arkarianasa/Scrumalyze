using Newtonsoft.Json;

namespace Scrumalyze.Models
{
    public class PrioritizationLevel
    {
        public int PrioritizationLevelID { get; set; }
        public int PrioritizationSchemeID { get; set; }
        public required string LevelName { get; set; }
        public int LevelValue { get; set; }

        [JsonIgnore] // Prevent circular reference
        public required PrioritizationScheme PrioritizationScheme { get; set; }
    }
}
