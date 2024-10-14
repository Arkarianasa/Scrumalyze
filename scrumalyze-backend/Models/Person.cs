using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class Person
    {
        public int PersonID { get; set; }
        public int ScrumTeamID { get; set; }
        public int RoleID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public virtual required ScrumRole Role { get; set; }
        public virtual ICollection<WorkItem> WorkItems { get; set; }
    }
}
