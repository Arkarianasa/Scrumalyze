using Microsoft.AspNetCore.Mvc;
using Scrumalyze.Models;
using Scrumalyze.Services;

namespace Scrumalyze.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamContextController : ControllerBase
    {
        private readonly TeamContextService _teamContextService;

        public TeamContextController(TeamContextService teamContextService)
        {
            _teamContextService = teamContextService;
        }

        [HttpGet("persons/{teamId}")]
        public ActionResult<List<Person>> GetPersonList(int teamId)
        {
            var persons = _teamContextService.GetPersonList(teamId);
            return Ok(persons);
        }

        [HttpGet("productgoal/{teamId}")]
        public ActionResult<ProductGoal> GetProductGoal(int teamId)
        {
            var productGoal = _teamContextService.GetProductGoal(teamId);
            if (productGoal == null)
            {
                return NotFound();
            }
            return Ok(productGoal);
        }

        [HttpGet("dod/{teamId}")]
        public ActionResult<List<DefinitionOfDone>> GetDoDList(int teamId)
        {
            var dodList = _teamContextService.GetDoDList(teamId);
            return Ok(dodList);
        }

        [HttpGet("acceptancecriteria/{teamId}")]
        public ActionResult<List<AcceptanceCriteria>> GetAcceptanceCriteriaList(int teamId)
        {
            var criteriaList = _teamContextService.GetAcceptanceCriteriaList(teamId);
            return Ok(criteriaList);
        }

        [HttpGet("timeboxes/{teamId}")]
        public ActionResult<List<Timebox>> GetTimeboxList(int teamId)
        {
            var timeboxes = _teamContextService.GetTimeboxList(teamId);
            return Ok(timeboxes);
        }

        [HttpGet("productbacklog/{teamId}")]
        public ActionResult<ProductBacklog> GetProductBacklog(int teamId)
        {
            var backlog = _teamContextService.GetProductBacklog(teamId);
            return Ok(backlog);
        }

        [HttpGet("workitems/{teamId}")]
        public ActionResult<List<WorkItem>> GetWorkItemList(int teamId)
        {
            var workItems = _teamContextService.GetWorkItemList(teamId);
            return Ok(workItems);
        }

        [HttpGet("sprints/{teamId}")]
        public ActionResult<List<Sprint>> GetSprintList(int teamId)
        {
            var sprints = _teamContextService.GetSprintList(teamId);
            return Ok(sprints);
        }

        [HttpGet("sprintbacklogs/{teamId}")]
        public ActionResult<List<SprintBacklog>> GetSprintBacklogList(int teamId)
        {
            var sprintBacklogs = _teamContextService.GetSprintBacklogList(teamId);
            return Ok(sprintBacklogs);
        }

        [HttpGet("sprintgoals/{teamId}")]
        public ActionResult<List<SprintGoal>> GetSprintGoalList(int teamId)
        {
            var sprintGoals = _teamContextService.GetSprintGoalList(teamId);
            return Ok(sprintGoals);
        }

        [HttpGet("processsteps/{teamId}")]
        public ActionResult<List<ProcessStep>> GetProcessStepList(int teamId)
        {
            var processSteps = _teamContextService.GetProcessStepList(teamId);
            return Ok(processSteps);
        }

        [HttpGet("increments/{teamId}")]
        public ActionResult<List<Increment>> GetIncrementList(int teamId)
        {
            var increments = _teamContextService.GetIncrementList(teamId);
            return Ok(increments);
        }
    }
}
