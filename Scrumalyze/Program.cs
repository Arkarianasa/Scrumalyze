using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Scrumalyze.Data;
using Scrumalyze.Services;
public class Program
{
    public static void Main(string[] args)
    {
        var builder = new ConfigurationBuilder()
            .AddJsonFile(Path.GetFullPath("../../../appsettings.json"));

        var configuration = builder.Build();

        var optionsBuilder = new DbContextOptionsBuilder<ScrumalyzeContext>();
        var options = optionsBuilder
            .UseSqlServer(configuration.GetConnectionString("ScrumalyzeDatabase"))
            .Options;

        using (var context = new ScrumalyzeContext(configuration))
        {
            var evaluationService = new ScrumEvaluationService(context);

            var evaluationResult = evaluationService.EvaluateScrumImplementation("Atomic");
            evaluationResult.PrettyPrint();

            evaluationResult.NullResult();

            evaluationResult = evaluationService.EvaluateScrumImplementation("Bionic");
            evaluationResult.PrettyPrint();

            evaluationResult.NullResult();

            evaluationResult = evaluationService.EvaluateScrumImplementation("Cosmic");
            evaluationResult.PrettyPrint();
        }
    }
}