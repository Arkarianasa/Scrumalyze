namespace Scrumalyze.Dtos
{
    public class WorkItemDto
    {
        public required string Description { get; set; }
        public int? TimeboxDtoID { get; set; }
        public int? BacklogItemDtoID { get; set; }
        public int WorkItemTypeID { get; set; }
        public DateTime Deadline { get; set; }
        public bool Done { get; set; }
        public required List<PersonDto> WorkingPersons { get; set; }
        public int? AcceptanceCriteriaID { get; set; }
        public int? DefinitionOfDoneID { get; set; }
    }
}
