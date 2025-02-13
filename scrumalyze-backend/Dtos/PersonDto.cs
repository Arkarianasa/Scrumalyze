namespace Scrumalyze.Dtos
{
    public class PersonDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public int RoleID { get; set; }
        public required bool IsScrumTeamMember { get; set; }
    }
}
