namespace Scrumalyze.Dtos
{
    public class ScrumTeamDto
    {
        public required string TeamName { get; set; }
        public required List<PersonDto> Persons { get; set; }
        public required ProductGoalDto ProductGoal { get; set; }
        public required List<BacklogItemDto> BacklogItems { get; set; }
        public required List<TimeboxDto> Timeboxes { get; set; }
        public required List<SprintDto> Sprints { get; set; }
        public required List<DefinitionOfDoneDto> DefinitionOfDone { get; set; }
        public required List<AcceptanceCriteriaDto> AcceptanceCriterias { get; set; }
        public required List<WorkItemDto> WorkItems { get; set; }
        public required List<IncrementDto> Increments { get; set; }
    }
}
