using Entities.Helpers;

namespace Entities.Models;

public class Test : IIdEntity
{
    public string Id { get; set; }
    public string TestName { get; set; }

    public Test(string name)
    {
        this.Id = Guid.NewGuid().ToString();
        this.TestName = name;
    }
    
    public Test() { }
}