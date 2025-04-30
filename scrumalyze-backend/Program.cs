using Microsoft.EntityFrameworkCore;
using Scrumalyze.Data;
using Scrumalyze.Services;
using System.Text.Json.Serialization;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Register AutoMapper
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

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

        var app = builder.Build();

        app.UseRouting();

        app.UseCors("AllowReactApp");

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
