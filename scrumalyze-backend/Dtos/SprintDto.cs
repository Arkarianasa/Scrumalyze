namespace Scrumalyze.Dtos
{
    public class SprintDto
    {
        public int? TimeboxDtoID { get; set; }
        public required List<int> BacklogItems { get; set; }
        public int? BacklogResponsiblePersonID { get; set; }
        public DateTime? EndDate { get; set; }
        public int? GoalResponsiblePersonID { get; set; }
        public required string SprintGoal { get; set; }
        public int? ProductGoalID { get; set; }
        public DateTime StartDate { get; set; }
    }
}
