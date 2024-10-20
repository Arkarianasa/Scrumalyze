namespace Scrumalyze.Dtos
{
    public class SprintDto
    {
        public required string SprintGoal { get; set; }
        public int GoalCreatedByPersonID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? TimeboxDtoID { get; set; }
        public required List<int> BacklogItems { get; set; }
    }
}
