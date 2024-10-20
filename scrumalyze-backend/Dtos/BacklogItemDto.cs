namespace Scrumalyze.Dtos
{
    public class BacklogItemDto
    {
        public required string ItemName { get; set; }
        public required string ItemDescription { get; set; }
        public required string ItemPriority { get; set; }
        public bool Done { get; set; }
    }
}
