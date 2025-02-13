using AutoMapper;
using Scrumalyze.Models;
using Scrumalyze.Dtos;
using static System.Runtime.InteropServices.JavaScript.JSType;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<ScrumTeamDto, ScrumTeam>()
        .ForMember(dest => dest.Sprints, opt => opt.Ignore())
        .ForMember(dest => dest.Increments, opt => opt.Ignore())
        .ForMember(dest => dest.Persons, opt => opt.Ignore())
        .ForMember(dest => dest.ProductGoals, opt => opt.Ignore())
        .ForMember(dest => dest.DefinitionsOfDone, opt => opt.Ignore())
        .ForMember(dest => dest.Timeboxes, opt => opt.Ignore())
        // If you are also manually handling ProductBacklog, you might ignore it too.
        // .ForMember(dest => dest.ProductBacklog, opt => opt.Ignore())
        // ... keep the properties you actually want mapped automatically
        .ForMember(dest => dest.ScrumTeamID, opt => opt.Ignore());

        CreateMap<ScrumRoleDto, ScrumRole>();
        CreateMap<PersonDto, Person>();
        CreateMap<ProductGoalDto, ProductGoal>();
        CreateMap<ProductBacklogDto, ProductBacklog>();
        CreateMap<BacklogItemDto, BacklogItem>();
        CreateMap<TimeboxDto, Timebox>();
        CreateMap<SprintDto, Sprint>();
        CreateMap<DefinitionOfDoneDto, DefinitionOfDone>();
        CreateMap<WorkItemDto, WorkItem>();
        CreateMap<IncrementDto, Increment>();
    }
}