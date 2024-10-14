using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class Sprint
    {
        public int SprintID { get; set; }
        public int SprintGoalID { get; set; }
        public int ProductGoalID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? TimeboxID { get; set; }
        public virtual required SprintGoal SprintGoal { get; set; }
        public virtual required ProductGoal ProductGoal { get; set; }
        public virtual Timebox? Timebox { get; set; }
    }
}
