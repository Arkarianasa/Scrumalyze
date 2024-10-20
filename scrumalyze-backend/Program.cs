using Microsoft.EntityFrameworkCore;
using Scrumalyze.Data;
using Scrumalyze.Services;
using System.Text.Json.Serialization;

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

        builder.Services.AddControllers().AddJsonOptions(x =>
            x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

        builder.Services.AddScoped<ScrumEvaluationService>();
        builder.Services.AddScoped<GlobalService>();
        builder.Services.AddScoped<TeamService>();

        // Register AutoMapper
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        var app = builder.Build();

        // Enable CORS
        app.UseCors("AllowReactApp");

        app.MapControllers();  // Map controllers for API endpoints

        // Additional setup and running the service
        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ScrumalyzeContext>();
            var evaluationService = new ScrumEvaluationService(context);

            var evaluationResult = evaluationService.EvaluateScrumImplementation(1);
            evaluationResult.PrettyPrint();

            evaluationResult.NullResult();

            evaluationResult = evaluationService.EvaluateScrumImplementation(2);
            evaluationResult.PrettyPrint();

            evaluationResult.NullResult();

            evaluationResult = evaluationService.EvaluateScrumImplementation(3);
            evaluationResult.PrettyPrint();
        }

        app.Run();
    }
}
