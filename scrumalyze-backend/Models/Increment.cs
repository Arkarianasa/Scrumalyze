using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class Increment
    {
        public int IncrementID { get; set; }
        public int ScrumTeamID { get; set; }
        public int? SprintID { get; set; }
        public int? ProductGoalID { get; set; }
        public int? ReceivedByID { get; set; }
        public required string Description { get; set; }
        public DateTime? Deadline { get; set; }
        
        [JsonIgnore] // Prevent circular reference
        public required ScrumTeam ScrumTeam { get; set; }
        public Sprint? Sprint { get; set; }
        public ProductGoal? ProductGoal { get; set; }
        public Person? ReceivedBy { get; set; }
    }
}
