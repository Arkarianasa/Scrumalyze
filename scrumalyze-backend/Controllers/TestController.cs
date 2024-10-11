using Microsoft.AspNetCore.Mvc;

namespace Scrumalyze.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("The API is working!");
        }
    }
}
