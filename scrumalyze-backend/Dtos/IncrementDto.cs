namespace Scrumalyze.Dtos
{
    public class IncrementDto
    {
        public required string Description { get; set; }
        public required string RelatedSprintID { get; set; }
        public required string ReceivedByPersonID { get; set; }
        public bool RelatedToSprintGoal { get; set; }
        public bool HasDeadline { get; set; }
        public required List<int> WorkItems { get; set; }
        public bool RelatedToProductGoal { get; set; }
    }
}
