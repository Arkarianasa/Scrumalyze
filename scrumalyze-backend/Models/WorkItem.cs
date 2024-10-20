using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class WorkItem
    {
        public int WorkItemID { get; set; }
        public required string Description { get; set; }
        public int? BacklogItemID { get; set; }
        public int? AcceptanceCriteriaID { get; set; }
        public int? DefinitionOfDoneID { get; set; }
        public DateTime? Deadline { get; set; }
        public int? IncrementID { get; set; }
        public int WorkItemTypeID { get; set; }
        public int? TimeboxID { get; set; }
        public bool Done { get; set; }

        public BacklogItem? BacklogItem { get; set; }
        public AcceptanceCriteria? AcceptanceCriteria { get; set; }
        public DefinitionOfDone? DefinitionOfDone { get; set; }
        public Increment? Increment { get; set; }
        public required WorkItemType WorkItemType { get; set; }
        public Timebox? Timebox { get; set; }
        public required ICollection<PersonWorkItem> PersonWorkItems { get; set; }
    }
}
