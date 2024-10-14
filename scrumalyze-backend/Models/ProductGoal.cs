using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class ProductGoal
    {
        public int ProductGoalID { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int CreatedByPersonID { get; set; }
        public int ScrumTeamID { get; set; }
        public required Person CreatedByPerson { get; set; }
    }
}
