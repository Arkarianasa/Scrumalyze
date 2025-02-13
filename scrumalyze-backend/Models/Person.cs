using Newtonsoft.Json;
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
        public bool IsScrumTeamMember { get; set; }
        public required ScrumRole Role { get; set; }

        [JsonIgnore] // Prevent circular reference
        public required ScrumTeam ScrumTeam { get; set; }

        [JsonIgnore]
        public ICollection<WorkItem_Person>? WorkItems { get; set; }
    }
}
