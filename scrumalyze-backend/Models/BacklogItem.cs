using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class BacklogItem
    {
        public int BacklogItemID { get; set; }
        public required string ItemName { get; set; }
        public required string ItemDescription { get; set; }
        public int? ProductBacklogID { get; set; }
        public int? SprintBacklogID { get; set; }
        public bool Done { get; set; }
        public int? ItemPriority { get; set; }

        public ProductBacklog? ProductBacklog { get; set; }
        public SprintBacklog? SprintBacklog { get; set; }
    }
}
