using Microsoft.AspNetCore.Mvc;
using Scrumalyze.Services;

namespace Scrumalyze.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GlobalController : ControllerBase
    {
        private readonly GlobalService _globalContextService; // Inject your service for data access

        public GlobalController(GlobalService globalContextService)
        {
            _globalContextService = globalContextService;
        }

        [HttpGet]
        public IActionResult GetGlobalData()
        {
            var scrumTeams = _globalContextService.GetAllScrumTeams();
            var scrumRoles = _globalContextService.GetAllScrumRoles();
            var workItemTypes = _globalContextService.GetAllWorkItemTypes();
            var prioritizationSchemes = _globalContextService.GetAllPrioritizationSchemes();

            var globalData = new
            {
                ScrumTeams = scrumTeams,
                ScrumRoles = scrumRoles,
                WorkItemTypes = workItemTypes,
                PrioritizationSchemes = prioritizationSchemes
            };

            return Ok(globalData);
        }
    }
}
