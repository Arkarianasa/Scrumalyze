using Scrumalyze.Data;
using Scrumalyze.Models;

namespace Scrumalyze.Services
{
    public class GlobalService
    {
        private readonly ScrumalyzeContext _context;

        public GlobalService(ScrumalyzeContext context)
        {
            _context = context;
        }

        public List<ScrumTeam> GetAllScrumTeams()
        {
            return _context.ScrumTeam.ToList(); // Fetch all ScrumTeams
        }

        public List<WorkItemType> GetAllWorkItemTypes()
        {
            return _context.WorkItemType.ToList(); // Fetch all WorkItemTypes
        }

        public List<ScrumRole> GetAllScrumRoles()
        {
            return _context.ScrumRole.ToList(); // Fetch all ScrumRoles
        }
    }
}
