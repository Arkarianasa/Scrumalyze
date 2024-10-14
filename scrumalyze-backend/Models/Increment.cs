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
        public int SprintID { get; set; }
        public int? SprintGoalID { get; set; }
        public int? ProductGoalID { get; set; }
        public DateTime? Deadline { get; set; }
        public int? ReceivedByID { get; set; }
        public string IncrementDescription { get; set; } = string.Empty;

        public required Sprint Sprint { get; set; }
        public SprintGoal? SprintGoal { get; set; }
        public ProductGoal? ProductGoal { get; set; }
        public Person? ReceivedBy { get; set; }
    }
}
