namespace Scrumalyze.Dtos
{
    public class IncrementDto
    {
        public required int RelatedSprintDtoID { get; set; }
        public DateTime? Deadline { get; set; }
        public required string Description { get; set; }
        public int? ReceivedByPersonDtoID { get; set; }
        public int? RelatedProductGoalID { get; set; }
        public required List<int> WorkItems { get; set; }
    }
}
