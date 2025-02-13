using Newtonsoft.Json;

namespace Scrumalyze.Models
{
    public class WorkItem_AcceptanceCriteria
    {
        public int WorkItemID { get; set; }
        public int AcceptanceCriteriaID { get; set; }
        [JsonIgnore]
        public required WorkItem WorkItem { get; set; }
        public required AcceptanceCriteria AcceptanceCriteria { get; set; }
    }
}
