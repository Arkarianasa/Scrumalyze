using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class DefinitionOfDone
    {
        public int DefinitionOfDoneID { get; set; }
        public string ConstraintDescription { get; set; } = string.Empty;
        public bool ConstraintStatus { get; set; }
    }
}
