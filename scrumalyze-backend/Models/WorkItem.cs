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
        public int? BacklogItemID { get; set; }
        public int? AcceptanceCriteriaID { get; set; }
        public int? DefinitionOfDoneID { get; set; }
        public DateTime? Deadline { get; set; }
        public int? IncrementID { get; set; }
        public int WorkItemTypeID { get; set; }
        public int? TimeboxID { get; set; }
        public bool Done { get; set; }

        public virtual required BacklogItem BacklogItem { get; set; }
        public virtual AcceptanceCriteria? AcceptanceCriteria { get; set; }
        public virtual DefinitionOfDone? DefinitionOfDone { get; set; }
        public virtual Increment? Increment { get; set; }
        public virtual required WorkItemType WorkItemType { get; set; }
        public virtual Timebox? Timebox { get; set; }
        public virtual ICollection<Person> Persons { get; set; }
    }
}
