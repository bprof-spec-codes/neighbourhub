using Entities.Helpers;

namespace Entities.Models;

public class Document : IIdEntity
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string Path { get; set; }

    public Document()
    {
        Id = Guid.NewGuid().ToString();
    }
}