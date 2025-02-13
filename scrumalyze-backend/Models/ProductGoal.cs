using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Scrumalyze.Models
{
    public class ProductGoal
    {
        public int ProductGoalID { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? ResponsiblePersonID { get; set; }
        public int ScrumTeamID { get; set; }
        public Person? ResponsiblePerson { get; set; }
        [JsonIgnore]
        public ScrumTeam? ScrumTeam { get; set; }
    }
}
