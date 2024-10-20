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
        public DbSet<DefinitionOfDone> DefinitionOfDone { get; set; }
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
        public DbSet<WorkItemType> WorkItemType { get; set; }
        public DbSet<WorkItem> WorkItem { get; set; }
        public DbSet<Communication> Communication { get; set; }
        public DbSet<PersonWorkItem> PersonWorkItem { get; set; }

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
            // Implicit Many-to-Many Relationship between Person and WorkItem
            modelBuilder.Entity<PersonWorkItem>()
            .HasKey(pwi => new { pwi.PersonID, pwi.WorkItemID });

            modelBuilder.Entity<PersonWorkItem>()
            .HasOne(pwi => pwi.WorkItem)
            .WithMany(wi => wi.PersonWorkItems)
            .HasForeignKey(wi => wi.WorkItemID)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PersonWorkItem>()
            .HasOne(pwi => pwi.Person)
            .WithMany(p => p.PersonWorkItems)
            .HasForeignKey(p => p.PersonID)
            .OnDelete(DeleteBehavior.Restrict);

            // Configure the relationship between Person and ScrumRole
            modelBuilder.Entity<Person>()
                .HasOne(p => p.Role)
                .WithMany()
                .HasForeignKey(p => p.RoleID)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure the relationship between Person and ScrumTeam
            modelBuilder.Entity<Person>()
                .HasOne(p => p.ScrumTeam)
                .WithMany(st => st.Persons)
                .HasForeignKey(p => p.ScrumTeamID)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure the relationship between ProductGoal and Person
            modelBuilder.Entity<ProductGoal>()
                        .HasOne(pg => pg.CreatedByPerson)
                        .WithMany()
                        .HasForeignKey(pg => pg.CreatedByPersonID)
                        .OnDelete(DeleteBehavior.Restrict);

            // Configure the relationship between Product Goal and ScrumTeam
            modelBuilder.Entity<ProductGoal>()
                .HasOne(pg => pg.ScrumTeam)
                .WithMany()
                .HasForeignKey(pg => pg.ScrumTeamID)
                .OnDelete(DeleteBehavior.Restrict);

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

            modelBuilder.Entity<Timebox>()
                .HasOne(t => t.ScrumTeam)
                .WithMany()
                .HasForeignKey(t => t.ScrumTeamID)
                .OnDelete(DeleteBehavior.Restrict);

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

            modelBuilder.Entity<AcceptanceCriteria>()
                .HasOne(ac => ac.ScrumTeam)
                .WithMany()
                .HasForeignKey(ac => ac.ScrumTeamID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DefinitionOfDone>()
                .HasOne(dod => dod.ScrumTeam)
                .WithMany()
                .HasForeignKey(dod => dod.ScrumTeamID)
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
