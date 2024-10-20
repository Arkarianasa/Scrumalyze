namespace Scrumalyze.Dtos
{
    public class IncrementDto
    {
        public required string Description { get; set; }
        public required int RelatedSprintDtoID { get; set; }
        public required int ReceivedByPersonDtoID { get; set; }
        public bool RelatedToSprintGoal { get; set; }
        public DateTime Deadline { get; set; }
        public required List<int> WorkItems { get; set; }
        public bool RelatedToProductGoal { get; set; }
    }
}
