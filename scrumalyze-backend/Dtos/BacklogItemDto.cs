namespace Scrumalyze.Dtos
{
    public class BacklogItemDto
    {
        public bool Done { get; set; }
        public required string ItemName { get; set; }
        public required string ItemDescription { get; set; }
        public int? SprintBacklogID { get; set; }
        public int? PrimaryPriorityValue { get; set; }
        public int? ProductBacklogID { get; set; }
        public int? SecondaryPriorityValue { get; set; }
    }
}
