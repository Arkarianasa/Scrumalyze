namespace Scrumalyze.Dtos
{
    public class WorkItemDto
    {
        public int? BacklogItemDtoID { get; set; }
        public int? TimeboxDtoID { get; set; }
        public required List<string> AcceptanceCriterias { get; set; }
        public DateTime? Deadline { get; set; }
        public required List<int> DefinitionOfDoneIDs { get; set; }
        public required string Description { get; set; }
        public bool Done { get; set; }
        public int? WorkItemTypeID { get; set; }
        public required List<int> WorkingPersonIds { get; set; }
    }
}
