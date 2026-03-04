using Entities.Models;
using Logic.Logic;
using Microsoft.AspNetCore.Mvc;

namespace Endpoint.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController
{
    private readonly TestLogic testLogic;

    public TestController(TestLogic testLogic)
    {
        this.testLogic = testLogic;
    }

    [HttpGet]
    public IEnumerable<Test> GetTest()
    {
        return testLogic.GetTests();
    }
}