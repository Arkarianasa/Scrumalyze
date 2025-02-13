using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Scrumalyze.Models
{
    public class ProductBacklog
    {
        public int ProductBacklogID { get; set; }
        public int ScrumTeamID { get; set; }
        public int? ProductGoalID { get; set; }
        public int? ResponsiblePersonID { get; set; }
        public int? PrimaryPrioritizationSchemeID { get; set; }
        public int? SecondaryPrioritizationSchemeID { get; set; }

        [JsonIgnore]
        public virtual ScrumTeam? ScrumTeam { get; set; }
        public Person? ResponsiblePerson { get; set; }
        public ProductGoal? ProductGoal { get; set; }
        public ICollection<BacklogItem>? BacklogItems { get; set; }
    }
}
