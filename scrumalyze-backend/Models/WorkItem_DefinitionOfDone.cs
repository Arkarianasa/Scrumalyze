using Newtonsoft.Json;

namespace Scrumalyze.Models
{
    public class WorkItem_DefinitionOfDone
    {
        public int WorkItemID { get; set; }
        public int DefinitionOfDoneID { get; set; }
        [JsonIgnore]
        public required WorkItem WorkItem { get; set; }
        public required DefinitionOfDone DefinitionOfDone { get; set; }
    }
}
