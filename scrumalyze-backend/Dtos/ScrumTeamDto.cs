namespace Scrumalyze.Dtos
{
    public class ScrumTeamDto
    {
        public required List<BacklogItemDto> BacklogItems { get; set; }
        public required List<DefinitionOfDoneDto> DefinitionsOfDone { get; set; }
        public required List<IncrementDto> Increments { get; set; }
        public required List<PersonDto> Persons { get; set; }
        public required ProductBacklogDto ProductBacklog { get; set; }
        public required List<ProductGoalDto> ProductGoals { get; set; }
        public required List<ScrumRoleDto> ScrumRoles { get; set; }
        public required List<SprintDto> Sprints { get; set; }
        public required string TeamName { get; set; }
        public required List<TimeboxDto> Timeboxes { get; set; }
        public required int WorkDayHours { get; set; }
        public required List<WorkItemDto> WorkItems { get; set; }
    }
}
