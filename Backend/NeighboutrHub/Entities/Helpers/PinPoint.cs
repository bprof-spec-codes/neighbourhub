namespace Entities.Helpers;

public class PinPoint : IIdEntity
{
    public string Id { get; set; }
    public string Title { get; set; }
    public double Width { get; set; }
    public double Height { get; set; }

    public PinPoint(string title, double width, double height)
    {
        Id = Guid.NewGuid().ToString();
        Title = title;
        Width = width;
        Height = height;
    }
}