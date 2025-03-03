using Newtonsoft.Json;
using Scrumalyze.Dtos;
using Scrumalyze.Models.Scrumalyze.Classes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class ScrumTeam
    {
        public int ScrumTeamID { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public int WorkDayHours { get; set; }

        public virtual ICollection<ScrumRole> ScrumRoles { get; set; } = new List<ScrumRole>();
        public virtual ICollection<Person> Persons { get; set; } = new List<Person>();
        public virtual ICollection<ProductGoal> ProductGoals { get; set; } = new List<ProductGoal>();
        public virtual ICollection<DefinitionOfDone> DefinitionsOfDone { get; set; } = new List<DefinitionOfDone>();
        public virtual ICollection<Timebox> Timeboxes { get; set; } = new List<Timebox>();
        public virtual ICollection<Sprint> Sprints { get; set; } = new List<Sprint>();
        public virtual ICollection<ProcessStep> ProcessSteps { get; set; } = new List<ProcessStep>();
        public virtual ICollection<Increment> Increments { get; set; } = new List<Increment>();

        public virtual ProductBacklog? ProductBacklog { get; set; }

        [JsonIgnore]
        public virtual ICollection<ScrumEvaluation> ScrumEvaluations { get; set; } = new List<ScrumEvaluation>();
    }
}
