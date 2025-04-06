using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class Sprint
    {
        public int SprintID { get; set; }
        public int ScrumTeamID { get; set; }
        public int? SprintGoalID { get; set; }
        public int? ProductGoalID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? TimeboxID { get; set; }

        [JsonIgnore] // Prevent circular reference
        public required ScrumTeam ScrumTeam { get; set; }
        public SprintGoal? SprintGoal { get; set; }
        public ProductGoal? ProductGoal { get; set; }
        public Timebox? Timebox { get; set; }
        public ICollection<Increment>? Increments { get; set; }
    }
}
