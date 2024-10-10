using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class ProcessStep
    {
        public int ProcessStepID { get; set; }
        public required string ProcessStepName { get; set; }
        public int SprintID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? TimeboxID { get; set; }
        public int? GuidedByPersonID { get; set; }

        public required BacklogItem Sprint { get; set; }
        public Timebox? Timebox { get; set; }
        public Person? GuidedByPerson { get; set; }
    }
}
