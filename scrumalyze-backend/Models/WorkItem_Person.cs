using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class WorkItem_Person
    {
        public int WorkItemID { get; set; }
        public int PersonID { get; set; }
        public required Person Person { get; set; }
        
        [JsonIgnore]
        public required WorkItem WorkItem { get; set; }
    }
}
