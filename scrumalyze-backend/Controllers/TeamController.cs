using Microsoft.AspNetCore.Mvc;
using Scrumalyze.Models;
using Scrumalyze.Services;
using Scrumalyze.Dtos;
using AutoMapper;

namespace Scrumalyze.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly TeamService _teamService;
        private readonly GlobalService _globalContextService;

        public TeamController(TeamService teamContextService, GlobalService globalContextService)
        {
            _teamService = teamContextService;
            _globalContextService = globalContextService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateTeam([FromBody] ScrumTeamDto request)
        {

            // Call the service to save the team
            await _teamService.CreateTeamAsync(request);

            var scrumTeams = _globalContextService.GetAllScrumTeams();

            return Ok(scrumTeams);
        }

        [HttpGet("persons/{teamId}")]
        public ActionResult<List<Person>> GetPersonList(int teamId)
        {
            var persons = _teamService.GetPersonList(teamId);
            return Ok(persons);
        }

        [HttpGet("productgoal/{teamId}")]
        public ActionResult<ProductGoal> GetProductGoal(int teamId)
        {
            var productGoal = _teamService.GetProductGoal(teamId);
            if (productGoal == null)
            {
                return NotFound();
            }
            return Ok(productGoal);
        }

        [HttpGet("dod/{teamId}")]
        public ActionResult<List<DefinitionOfDone>> GetDoDList(int teamId)
        {
            var dodList = _teamService.GetDoDList(teamId);
            return Ok(dodList);
        }

        [HttpGet("acceptancecriteria/{teamId}")]
        public ActionResult<List<AcceptanceCriteria>> GetAcceptanceCriteriaList(int teamId)
        {
            var criteriaList = _teamService.GetAcceptanceCriteriaList(teamId);
            return Ok(criteriaList);
        }

        [HttpGet("timeboxes/{teamId}")]
        public ActionResult<List<Timebox>> GetTimeboxList(int teamId)
        {
            var timeboxes = _teamService.GetTimeboxList(teamId);
            return Ok(timeboxes);
        }

        [HttpGet("productbacklog/{teamId}")]
        public ActionResult<ProductBacklog> GetProductBacklog(int teamId)
        {
            var backlog = _teamService.GetProductBacklog(teamId);
            return Ok(backlog);
        }

        [HttpGet("workitems/{teamId}")]
        public ActionResult<List<WorkItem>> GetWorkItemList(int teamId)
        {
            var workItems = _teamService.GetWorkItemList(teamId);
            return Ok(workItems);
        }

        [HttpGet("sprints/{teamId}")]
        public ActionResult<List<Sprint>> GetSprintList(int teamId)
        {
            var sprints = _teamService.GetSprintList(teamId);
            return Ok(sprints);
        }

        [HttpGet("sprintbacklogs/{teamId}")]
        public ActionResult<List<SprintBacklog>> GetSprintBacklogList(int teamId)
        {
            var sprintBacklogs = _teamService.GetSprintBacklogList(teamId);
            return Ok(sprintBacklogs);
        }

        [HttpGet("processsteps/{teamId}")]
        public ActionResult<List<ProcessStep>> GetProcessStepList(int teamId)
        {
            var processSteps = _teamService.GetProcessStepList(teamId);
            return Ok(processSteps);
        }

        [HttpGet("increments/{teamId}")]
        public ActionResult<List<Increment>> GetIncrementList(int teamId)
        {
            var increments = _teamService.GetIncrementList(teamId);
            return Ok(increments);
        }
    }
}
