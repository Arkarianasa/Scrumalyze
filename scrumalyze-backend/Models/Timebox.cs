using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class Timebox
    {
        public int TimeboxID { get; set; }
        public double Duration { get; set; }
        public string TimeboxDescription { get; set; } = string.Empty;
        public int ScrumTeamID { get; set; }
        public ScrumTeam? ScrumTeam { get; set; }
    }
}
