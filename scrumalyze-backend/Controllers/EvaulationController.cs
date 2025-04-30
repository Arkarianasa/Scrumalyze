using Microsoft.AspNetCore.Mvc;
using Scrumalyze.Services;
using Scrumalyze.Models;

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

        /// <summary>
        /// GET: api/evaluation/{teamID}/latest
        /// Returns the most recent (latest) evaluation for the given team, if any.
        /// </summary>
        [HttpGet("{teamID}/latest")]
        public IActionResult GetLatestEvaluation(int teamID)
        {
            var latestEval = _evaluationService.GetLatestEvaluation(teamID);
            if (latestEval == null)
            {
                return NotFound($"No evaluation found for team '{teamID}'.");
            }
            return Ok(latestEval);
        }

        /// <summary>
        /// GET: api/evaluation/{teamID}
        /// Runs a new set of tests for the given team, saves to DB, and returns the new evaluation.
        /// </summary>
        [HttpGet("{teamID}")]
        public IActionResult RunNewEvaluation(int teamID)
        {
            // EvaluateScrumImplementation runs the Groovy scripts, 
            // stores the new records, and returns the newly created ScrumEvaluation.
            var newEval = _evaluationService.EvaluateScrumImplementation(teamID);

            if (newEval == null)
            {
                return NotFound($"Team '{teamID}' not found or cannot be evaluated.");
            }

            newEval.ScrumTeam = null;
            return Ok(newEval);
        }
    }
}
