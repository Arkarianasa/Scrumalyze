using Microsoft.AspNetCore.Mvc;
using Scrumalyze.Services;

namespace Scrumalyze.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EvaluationController : ControllerBase
    {
        private readonly ScrumEvaluationService _evaluationService;

        public EvaluationController(ScrumEvaluationService evaluationService)
        {
            _evaluationService = evaluationService;
        }

        [HttpGet("{teamID}")]
        public IActionResult GetEvaluationResult(int teamID)
        {
            var evaluationResult = _evaluationService.EvaluateScrumImplementation(teamID);

            if (evaluationResult == null)
            {
                return NotFound($"No evaluation found for team '{teamID}'.");
            }

            return Ok(new
            {
                TeamID = teamID,
                Result = evaluationResult
            });
        }
    }
}
