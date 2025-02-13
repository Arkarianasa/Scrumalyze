using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Scrumalyze.Models
{
    public class ScrumRole
    {
        public int RoleID { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string RoleDescription { get; set; } = string.Empty;
        public int? ScrumTeamID { get; set; }
        [JsonIgnore]
        public ScrumTeam? ScrumTeam { get; set; }
    }
}
