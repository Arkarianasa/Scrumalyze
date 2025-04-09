namespace Scrumalyze.Dtos
{
    public class TimeboxDto
    {
        public required string TimeboxDescription { get; set; }
        //public required string Duration { get; set; }
        public int Days { get; set; }
        public int Hours { get; set; }
        public int Minutes { get; set; }
    }
}
