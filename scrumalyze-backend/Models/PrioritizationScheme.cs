namespace Scrumalyze.Models
{
    public class PrioritizationScheme
    {
        public int PrioritizationSchemeID { get; set; }
        public required string SchemeName { get; set; }
        public required List<PrioritizationLevel> PrioritizationLevels { get; set; } = [];
    }
}
