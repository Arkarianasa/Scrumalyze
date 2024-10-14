using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class SprintGoal
    {
        public int SprintGoalID { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int CreatedByPersonID { get; set; }
        public virtual required Person CreatedByPerson { get; set; }
    }
}
