namespace Scrumalyze.Dtos
{
    public class ProcessStepDto
    {
        public int? TimeboxID { get; set; }
        public int? GuidedByPersonID { get; set; }

        //public double AverageDuration { get; set; }
        public int Days { get; set; }
        public int Hours { get; set; }
        public int Minutes { get; set; }

        public bool ReviewsIncrement { get; set; }
        public bool UpdatesProductBacklog { get; set; }
        public bool AdjustsProductGoal { get; set; }
        public bool CreatesSprintGoal { get; set; }
        public bool ImprovesSprint { get; set; }
    }
}
