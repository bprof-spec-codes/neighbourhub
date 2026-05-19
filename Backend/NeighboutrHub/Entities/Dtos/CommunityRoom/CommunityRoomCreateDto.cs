namespace Entities.Dtos.CommunityRoom
{
    public class CommunityRoomCreateDto
    {
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty;
        public int Capacity { get; set; }
    }
}
