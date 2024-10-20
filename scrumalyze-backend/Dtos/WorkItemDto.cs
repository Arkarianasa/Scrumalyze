namespace Scrumalyze.Dtos
{
    public class WorkItemDto
    {
        public required string Description { get; set; }
        public int? TimeboxID { get; set; }
        public int BacklogItemID { get; set; }
        public required string DefinitionOfDone { get; set; }
        public int WorkItemTypeID { get; set; }
        public bool HasDeadline { get; set; }
        public bool Done { get; set; }
        public required List<PersonDto> WorkingPersons { get; set; }
        public int AcceptanceCriteria { get; set; }
        public int? DefinitionOfDoneID { get; set; }
    }
}
