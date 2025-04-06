using Microsoft.EntityFrameworkCore;
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
            return [.. _context.ScrumTeam.Include(t => t.ScrumRoles)]; // Fetch all ScrumTeams
        }

        public List<WorkItemType> GetAllWorkItemTypes()
        {
            return [.. _context.WorkItemType]; // Fetch all WorkItemTypes
        }

        public List<ProcessStepType> GetAllProcessStepTypes()
        {
            return [.. _context.ProcessStepType]; // Fetch all ProcessStepTypes
        }

        public List<ScrumRole> GetAllScrumRoles()
        {
            return [.. _context.ScrumRole.Where(role => role.ScrumTeamID == null)];
        }
        public List<PrioritizationScheme> GetAllPrioritizationSchemes()
        {
            return [.. _context.PrioritizationScheme.Include(ps => ps.PrioritizationLevels)]; // Fetch all PrioritizationSchemes
        }
    }
}
