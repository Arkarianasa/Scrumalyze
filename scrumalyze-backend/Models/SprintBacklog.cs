using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class SprintBacklog
    {
        public int SprintBacklogID { get; set; }
        public int SprintID { get; set; }
        public required Sprint Sprint { get; set; }
        public int? ResponsiblePersonID { get; set; }
        public Person? ResponsiblePerson { get; set; }
        public ICollection<BacklogItem>? BacklogItems { get; set; }
    }
}
