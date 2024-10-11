using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class ProductBacklog
    {
        public int ProductBacklogID { get; set; }
        public int ProductGoalID { get; set; }

        public required ProductGoal ProductGoal { get; set; }
        public ICollection<BacklogItem> BacklogItems { get; set; } = new List<BacklogItem>();
    }
}
