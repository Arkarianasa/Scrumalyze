using Microsoft.EntityFrameworkCore;
using Scrumalyze.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Scrumalyze.Models.Scrumalyze.Classes;

namespace Scrumalyze.Data
{
    public class ScrumalyzeContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public DbSet<ScrumTeam> ScrumTeam { get; set; }

        public DbSet<ScrumEvaluation> ScrumEvaluation { get; set; }
        public DbSet<ScrumEvaluationTest> ScrumEvaluationTest { get; set; }

        public DbSet<Timebox> Timebox { get; set; }
        public DbSet<AcceptanceCriteria> AcceptanceCriteria { get; set; }
        public DbSet<DefinitionOfDone> DefinitionOfDone { get; set; }
        public DbSet<PrioritizationScheme> PrioritizationScheme { get; set; }
        public DbSet<PrioritizationLevel> PrioritizationLevel { get; set; }
        public DbSet<ScrumRole> ScrumRole { get; set; }
        public DbSet<Person> Person { get; set; }
        public DbSet<SprintGoal> SprintGoal { get; set; }
        public DbSet<ProductGoal> ProductGoal { get; set; }
        public DbSet<Sprint> Sprint { get; set; }
        public DbSet<Increment> Increment { get; set; }
        public DbSet<ProductBacklog> ProductBacklog { get; set; }
        public DbSet<SprintBacklog> SprintBacklog { get; set; }
        public DbSet<BacklogItem> BacklogItem { get; set; }
        public DbSet<ProcessStepType> ProcessStepType { get; set; }
        public DbSet<ProcessStep> ProcessStep { get; set; }
        public DbSet<WorkItemType> WorkItemType { get; set; }
        public DbSet<WorkItem> WorkItem { get; set; }
        public DbSet<Communication> Communication { get; set; }
        public DbSet<WorkItem_Person> WorkItem_Person { get; set; }
        public DbSet<WorkItem_DefinitionOfDone> WorkItem_DefinitionOfDone { get; set; }
        public DbSet<WorkItem_AcceptanceCriteria> WorkItem_AcceptanceCriteria { get; set; }

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
            modelBuilder.Entity<ScrumEvaluation>(entity =>
            {
                entity.HasKey(e => e.ScrumEvaluationID);
                entity.Property(e => e.EvaluatedOn)
                      .HasDefaultValueSql("SYSUTCDATETIME()");
            });

            modelBuilder.Entity<ScrumEvaluationTest>(entity =>
            {
                entity.HasKey(e => e.ScrumEvaluationTestID);

                entity.HasOne(e => e.ScrumEvaluation)
                      .WithMany(se => se.Tests)
                      .HasForeignKey(e => e.ScrumEvaluationID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // PrioritizationScheme Primary Key
            modelBuilder.Entity<PrioritizationScheme>()
                .HasKey(ps => ps.PrioritizationSchemeID);

            modelBuilder.Entity<PrioritizationScheme>()
                .HasMany(ps => ps.PrioritizationLevels)
                .WithOne(pl => pl.PrioritizationScheme)
                .HasForeignKey(pl => pl.PrioritizationSchemeID)
                .OnDelete(DeleteBehavior.Cascade);

            // PrioritizationLevel Primary Key
            modelBuilder.Entity<PrioritizationLevel>()
                .HasKey(pl => pl.PrioritizationLevelID);

            // Implicit Many-to-Many Relationship between Person and WorkItem
            modelBuilder.Entity<WorkItem_Person>()
            .HasKey(pwi => new { pwi.PersonID, pwi.WorkItemID });

            modelBuilder.Entity<WorkItem_Person>()
            .HasOne(pwi => pwi.WorkItem)
            .WithMany(wi => wi.Persons)
            .HasForeignKey(wi => wi.WorkItemID)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WorkItem_Person>()
            .HasOne(pwi => pwi.Person)
            .WithMany(p => p.WorkItems)
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

            // Configure the relationship between Increment and ScrumTeam
            modelBuilder.Entity<Increment>()
                .HasOne(i => i.ScrumTeam)
                .WithMany(st => st.Increments)
                .HasForeignKey(i => i.ScrumTeamID)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure the relationship between ProductGoal and Person
            modelBuilder.Entity<ProductGoal>()
                        .HasOne(pg => pg.ResponsiblePerson)
                        .WithMany()
                        .HasForeignKey(pg => pg.ResponsiblePersonID)
                        .OnDelete(DeleteBehavior.Restrict);

            // Configure the relationship between SprintGoal and Person
            modelBuilder.Entity<SprintGoal>()
                        .HasOne(sg => sg.ResponsiblePerson)
                        .WithMany()
                        .HasForeignKey(sg => sg.ResponsiblePersonID)
                        .OnDelete(DeleteBehavior.Restrict);

            // Configure the relationship between ProductBacklog and Person
            modelBuilder.Entity<ProductBacklog>()
                        .HasOne(pb => pb.ResponsiblePerson)
                        .WithMany()
                        .HasForeignKey(pb => pb.ResponsiblePersonID)
                        .OnDelete(DeleteBehavior.Restrict);

            // Configure the relationship between SprintBacklog and Person
            modelBuilder.Entity<SprintBacklog>()
                        .HasOne(sb => sb.ResponsiblePerson)
                        .WithMany()
                        .HasForeignKey(sb => sb.ResponsiblePersonID)
                        .OnDelete(DeleteBehavior.Restrict);

            // Configure the relationship between Product Goal and ScrumTeam
            modelBuilder.Entity<ProductGoal>()
                .HasOne(pg => pg.ScrumTeam)
                .WithMany(st => st.ProductGoals)
                .HasForeignKey(pg => pg.ScrumTeamID)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure the relationship between Product Backlog and ScrumTeam
            modelBuilder.Entity<ProductBacklog>()
            .HasOne(pb => pb.ScrumTeam)
            .WithOne(st => st.ProductBacklog)
            .HasForeignKey<ProductBacklog>(pb => pb.ScrumTeamID);

            // Configure the relationship between Sprint and ScrumTeam
            modelBuilder.Entity<Sprint>()
                .HasOne(s => s.ScrumTeam)
                .WithMany(st => st.Sprints)
                .HasForeignKey(s => s.ScrumTeamID)
                .OnDelete(DeleteBehavior.Restrict);

            // ScrumRole Primary Key
            modelBuilder.Entity<ScrumRole>()
                .HasKey(r => r.RoleID);

            // Configure the relationship between ScrumRole and ScrumTeam
            modelBuilder.Entity<ScrumRole>()
                .HasOne(sr => sr.ScrumTeam)
                .WithMany(st => st.ScrumRoles)
                .HasForeignKey(sr => sr.ScrumTeamID)
                .OnDelete(DeleteBehavior.Restrict);

            // Process Step relations
            modelBuilder.Entity<ProcessStep>()
                .HasOne(ps => ps.GuidedByPerson)
                .WithMany()
                .HasForeignKey(ps => ps.GuidedByPersonID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ProcessStep>()
                .HasOne(ps => ps.ProcessStepType)
                .WithMany()
                .HasForeignKey(ps => ps.ProcessStepTypeID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ProcessStep>()
                .HasOne(ps => ps.ScrumTeam)
                .WithMany(st => st.ProcessSteps)
                .HasForeignKey(ps => ps.ScrumTeamID)
                .OnDelete(DeleteBehavior.SetNull);

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
                .WithMany(st => st.Timeboxes)
                .HasForeignKey(t => t.ScrumTeamID)
                .OnDelete(DeleteBehavior.Restrict);

            // Implicit Many-to-Many Relationship between WorkItem and AcceptanceCriteria
            modelBuilder.Entity<WorkItem_AcceptanceCriteria>()
                .HasKey(wac => new { wac.WorkItemID, wac.AcceptanceCriteriaID });

            modelBuilder.Entity<WorkItem_AcceptanceCriteria>()
                .HasOne(wac => wac.WorkItem)
                .WithMany(wi => wi.AcceptanceCriterias)
                .HasForeignKey(wac => wac.WorkItemID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WorkItem_AcceptanceCriteria>()
                .HasOne(wac => wac.AcceptanceCriteria)
                .WithMany(ac => ac.WorkItems)
                .HasForeignKey(wac => wac.AcceptanceCriteriaID)
                .OnDelete(DeleteBehavior.Restrict);

            // Implicit Many-to-Many Relationship between WorkItem and DefinitionOfDone
            modelBuilder.Entity<WorkItem_DefinitionOfDone>()
                .HasKey(wdd => new { wdd.WorkItemID, wdd.DefinitionOfDoneID });

            modelBuilder.Entity<WorkItem_DefinitionOfDone>()
                .HasOne(wdd => wdd.WorkItem)
                .WithMany(wi => wi.DefinitionsOfDone)
                .HasForeignKey(wdd => wdd.WorkItemID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WorkItem_DefinitionOfDone>()
                .HasOne(wdd => wdd.DefinitionOfDone)
                .WithMany(dod => dod.WorkItems)
                .HasForeignKey(wdd => wdd.DefinitionOfDoneID)
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
