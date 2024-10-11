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

        [HttpGet("{teamname}")]
        public IActionResult GetEvaluationResult(string teamname)
        {
            var evaluationResult = _evaluationService.EvaluateScrumImplementation(teamname);

            if (evaluationResult == null)
            {
                return NotFound($"No evaluation found for team '{teamname}'.");
            }

            return Ok(new
            {
                TeamName = teamname,
                Result = evaluationResult
            });
        }
    }
}
