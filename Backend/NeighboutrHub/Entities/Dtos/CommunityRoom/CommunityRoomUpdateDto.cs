namespace Entities.Dtos.CommunityRoom
{
    public class CommunityRoomUpdateDto
    {
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public bool IsActive { get; set; }
    }
}
