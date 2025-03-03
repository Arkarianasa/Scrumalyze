using Newtonsoft.Json;
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
        public required int ProcessStepTypeID { get; set; }
        public required int ScrumTeamID { get; set; }
        public int? TimeboxID { get; set; }
        public int? GuidedByPersonID { get; set; }

        public double AverageDuration { get; set; }

        public bool ReviewsIncrement { get; set; }      // DailySCRUM
        public bool UpdatesProductBacklog { get; set; } // BacklogRefinement
        public bool AdjustsProductGoal { get; set; }    // SprintReview
        public bool CreatesSprintGoal { get; set; }     // SprintPlanning
        public bool ImprovesSprint { get; set; }        // SprintRetrospective

        [JsonIgnore] // Prevent circular reference
        public ScrumTeam? ScrumTeam { get; set; }

        public ProcessStepType? ProcessStepType { get; set; }
        public Timebox? Timebox { get; set; }
        public Person? GuidedByPerson { get; set; }
    }
}
