using Microsoft.EntityFrameworkCore;
using Scrumalyze.Data;
using Scrumalyze.Models;

namespace Scrumalyze.Services
{
    public class TeamService
    {
        private readonly ScrumalyzeContext _context;

        public TeamService(ScrumalyzeContext context)
        {
            _context = context;
        }

        public List<Person> GetPersonList(int teamID)
        {  
            return _context.Person
                .Include(p => p.Role)
                .Where(p => p.ScrumTeamID == teamID)
                .ToList();
        }
        public ProductGoal? GetProductGoal(int teamID)
        {
            return _context.ProductGoal.Include(pg => pg.CreatedByPerson).FirstOrDefault(pg => pg.ScrumTeamID == teamID);
        }
        public List<DefinitionOfDone> GetDoDList(int teamID)
        {
            return _context.DefinitionOfDone.Where(dod => dod.ScrumTeamID == teamID).ToList();
        }
        public List<AcceptanceCriteria> GetAcceptanceCriteriaList(int teamID)
        {
            return _context.AcceptanceCriteria.Where(ac => ac.ScrumTeamID == teamID).ToList();
        }
        public List<Timebox> GetTimeboxList(int teamID)
        {
            return _context.Timebox.Where(t => t.ScrumTeamID == teamID).ToList();
        }
        public ProductBacklog? GetProductBacklog(int teamID)
        {
            return _context.ProductBacklog
                .Include(pg => pg.BacklogItems)
                .FirstOrDefault(pb => pb.ProductGoal.ScrumTeamID == teamID);

        }
        public List<WorkItem> GetWorkItemList(int teamID)
        {
            return _context.WorkItem.Where(wi => wi.BacklogItem.ProductBacklog.ProductGoal.ScrumTeamID == teamID).ToList();
        }
        public List<Sprint> GetSprintList(int teamID)
        {
            return _context.Sprint
                .Include(s => s.SprintGoal)
                .Where(s => s.ProductGoal.ScrumTeamID == teamID)
                .ToList();
        }
        public List<SprintBacklog> GetSprintBacklogList(int teamID)
        {
            return _context.SprintBacklog.Where(sb => sb.Sprint.ProductGoal.ScrumTeamID == teamID).ToList();
        }
        public List<SprintGoal> GetSprintGoalList(int teamID)
        {
            return _context.SprintGoal.Where(sg => sg.CreatedByPerson.ScrumTeamID == teamID).ToList();
        }
        public List<ProcessStep> GetProcessStepList(int teamID)
        {
            return _context.ProcessStep.Where(ps => ps.Sprint.ProductGoal.ScrumTeamID == teamID).ToList();
        }
        public List<Increment> GetIncrementList(int teamID)
        {
            return _context.Increment.Where(i => i.Sprint.ProductGoal.ScrumTeamID == teamID).ToList();
        }
    }
}
