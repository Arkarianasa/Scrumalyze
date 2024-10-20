using AutoMapper;
using Scrumalyze.Models;
using Scrumalyze.Dtos;
using static System.Runtime.InteropServices.JavaScript.JSType;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Map ScrumTeamDto to ScrumTeam and vice versa
        CreateMap<ScrumTeamDto, ScrumTeam>()
            .ForMember(dest => dest.TeamName, opt => opt.MapFrom(src => src.TeamName));

        // Map PersonDto to Person and vice versa
        CreateMap<PersonDto, Person>();

        // Add mappings for other DTOs as needed
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