using AutoMapper;
using Scrumalyze.Models;
using Scrumalyze.Dtos;
using static System.Runtime.InteropServices.JavaScript.JSType;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<ScrumTeamDto, ScrumTeam>();
        CreateMap<PersonDto, Person>();
        CreateMap<ProductGoalDto, ProductGoal>();
        CreateMap<BacklogItemDto, BacklogItem>();
        CreateMap<TimeboxDto, Timebox>();
        CreateMap<SprintDto, Sprint>();
        CreateMap<DefinitionOfDoneDto, DefinitionOfDone>();
        CreateMap<AcceptanceCriteriaDto, AcceptanceCriteria>();
        CreateMap<WorkItemDto, WorkItem>();
        CreateMap<IncrementDto, Increment>();
    }
}