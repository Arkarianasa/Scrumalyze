using Newtonsoft.Json;
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
        public int? PrimaryPriorityValue { get; set; }
        public int? SecondaryPriorityValue { get; set; }

        [JsonIgnore]
        public ProductBacklog? ProductBacklog { get; set; }

        [JsonIgnore]
        public SprintBacklog? SprintBacklog { get; set; }
    }
}
