using Data;
using Entities.Models;

namespace Logic.Logic;

public class TestLogic
{
    private readonly Repository<Test> testRepository;

    public TestLogic(Repository<Test> testRepository)
    {
        this.testRepository = testRepository;
    }
    
    public IEnumerable<Test> GetTests()
    {
        var tests = testRepository.GetAll();

        if (tests.Any())
        {
            return tests;
        }
        
        var testToAdd = new Test("Test");
        testRepository.Add(testToAdd);
        
        return testRepository.GetAll();
    }
}