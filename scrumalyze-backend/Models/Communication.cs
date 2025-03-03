using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class Communication
    {
        public int CommunicationID { get; set; }
        public int SourcePersonID { get; set; }
        public int TargetPersonID { get; set; }

        public required Person SourcePerson { get; set; }
        public required Person TargetPerson { get; set; }
    }
}
