using Microsoft.EntityFrameworkCore;
using Scrumalyze.Data;
using Scrumalyze.Services;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Configure services
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp",
                policy =>
                {
                    policy.WithOrigins("http://localhost:3000") // React dev server
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
        });

        // Add the context and other services
        builder.Services.AddDbContext<ScrumalyzeContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("ScrumalyzeDatabase"))
        );

        builder.Services.AddControllers();  // Assuming you're exposing API controllers
        
        builder.Services.AddScoped<ScrumEvaluationService>();

        var app = builder.Build();

        // Enable CORS
        app.UseCors("AllowReactApp");

        app.MapControllers();  // Map controllers for API endpoints

        // Additional setup and running the service
        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ScrumalyzeContext>();
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

        app.Run();
    }
}
