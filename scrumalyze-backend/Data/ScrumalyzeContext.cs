using Microsoft.EntityFrameworkCore;
using Scrumalyze.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Data
{
    public class ScrumalyzeContext : DbContext
    {
        protected readonly IConfiguration Configuration;
        public DbSet<Timebox> Timebox { get; set; }
        public DbSet<AcceptanceCriteria> AcceptanceCriteria { get; set; }
        public DbSet<DefinitionOfDone> DefinitionsOfDone { get; set; }
        public DbSet<ScrumTeam> ScrumTeam { get; set; }
        public DbSet<ScrumRole> ScrumRole { get; set; }
        public DbSet<Person> Person { get; set; }
        public DbSet<SprintGoal> SprintGoal { get; set; }
        public DbSet<ProductGoal> ProductGoal { get; set; }
        public DbSet<Sprint> Sprint { get; set; }
        public DbSet<Increment> Increment { get; set; }
        public DbSet<ProductBacklog> ProductBacklog { get; set; }
        public DbSet<SprintBacklog> SprintBacklog { get; set; }
        public DbSet<BacklogItem> BacklogItem { get; set; }
        public DbSet<ProcessStep> ProcessStep { get; set; }
        public DbSet<WorkItemType> WorkItemTypes { get; set; }
        public DbSet<WorkItem> WorkItem { get; set; }
        public DbSet<Communication> Communication { get; set; }

        public ScrumalyzeContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Using the connection string from appsettings.json
                var connectionString = Configuration.GetConnectionString("ScrumalyzeDatabase");
                optionsBuilder.UseSqlServer(connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Implicit Many-to-Many Relationship between Person and WorkItem instead of PersonWorkItem
            modelBuilder.Entity<Person>()
            .HasMany(p => p.WorkItems)
            .WithMany(w => w.Persons)
            .UsingEntity(j => j.ToTable("PersonWorkItems"));

            // Configure the relationship between Person and ScrumRole
            modelBuilder.Entity<Person>()
                .HasOne(p => p.Role)
                .WithMany(r => r.Persons)
                .HasForeignKey(p => p.RoleID);

            // ScrumRole Primary Key
            modelBuilder.Entity<ScrumRole>()
                .HasKey(r => r.RoleID);

            // Timebox relationships
            modelBuilder.Entity<Sprint>()
                .HasOne(s => s.Timebox)
                .WithMany()
                .HasForeignKey(s => s.TimeboxID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ProcessStep>()
                .HasOne(ps => ps.Timebox)
                .WithMany()
                .HasForeignKey(ps => ps.TimeboxID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<WorkItem>()
                .HasOne(wi => wi.Timebox)
                .WithMany()
                .HasForeignKey(wi => wi.TimeboxID)
                .OnDelete(DeleteBehavior.SetNull);

            // Acceptance Criteria and Definition of Done relationships
            modelBuilder.Entity<WorkItem>()
                .HasOne(wi => wi.AcceptanceCriteria)
                .WithMany()
                .HasForeignKey(wi => wi.AcceptanceCriteriaID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WorkItem>()
                .HasOne(wi => wi.DefinitionOfDone)
                .WithMany()
                .HasForeignKey(wi => wi.DefinitionOfDoneID)
                .OnDelete(DeleteBehavior.Restrict);

            // Sprint and SprintGoal/ProductGoal relationships
            modelBuilder.Entity<Sprint>()
                .HasOne(s => s.SprintGoal)
                .WithMany()
                .HasForeignKey(s => s.SprintGoalID);

            modelBuilder.Entity<Sprint>()
                .HasOne(s => s.ProductGoal)
                .WithMany()
                .HasForeignKey(s => s.ProductGoalID);

            // Increment relationships
            modelBuilder.Entity<Increment>()
                .HasOne(i => i.Sprint)
                .WithMany()
                .HasForeignKey(i => i.SprintID);

            modelBuilder.Entity<Increment>()
                .HasOne(i => i.SprintGoal)
                .WithMany()
                .HasForeignKey(i => i.SprintGoalID);

            modelBuilder.Entity<Increment>()
                .HasOne(i => i.ProductGoal)
                .WithMany()
                .HasForeignKey(i => i.ProductGoalID);

            // Communication foreign key relationship
            modelBuilder.Entity<Communication>()
                .HasOne(c => c.SourcePerson)
                .WithMany()
                .HasForeignKey(c => c.SourcePersonID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Communication>()
                .HasOne(c => c.TargetPerson)
                .WithMany()
                .HasForeignKey(c => c.TargetPersonID)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }
    }
}
