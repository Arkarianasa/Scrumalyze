#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether each Sprint has a non-null, non-empty Sprint Backlog.
 * Fails if any Sprint's SprintBacklog is null or empty.
 *
 * Usage: groovy SprintBacklogExists.groovy <path_to_json_file>
 *
 * @param teamData A Map containing a "team" object that may have "Sprints".
 * @return A map with standard evaluation fields:
 *         - name
 *         - definition
 *         - severity
 *         - passed
 *         - outcomeDescription
 *         - symptoms
 *         - possibleRootCauses
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Sprint Backlog Exists Check"
    def severityFail = "Major"
    def definition = """
        This check ensures that each Sprint is assigned a non-null and non-empty 
        Sprint Backlog.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 1

    def possibleRootCauses = [
        "Sprint Backlog might exist but is not correctly recorded in the system for one or more Sprints.",
        "Sprint Planning was incomplete or not properly executed, leading to an empty backlog.",
        "Work items are being tracked outside the Scrum framework, bypassing the Sprint Backlog.",
        "Sprint Goals and priorities were unclear, leading to a lack of planned work items.",
        "The team is not using Sprint Backlogs and only works with the Product Backlog."
    ]

    def consequences = []
    consequences << "Loss of structure – without a Sprint Backlog, the team lacks a clear execution plan."
    consequences << "Reduced transparency – stakeholders and the team may not have visibility into Sprint progress."
    consequences << "Misalignment – unclear Sprint objectives may lead to confusion about what work is being delivered."
    consequences << "Increased risk of Sprint failure – missing backlog items may result in an unproductive iteration."
    consequences << "Difficulty in tracking progress – without a defined Sprint Backlog, velocity and forecasting accuracy suffer."
    consequences << "Scrum Team inefficiency – lack of clear Sprint tasks can lead to idle time, misallocated efforts, or chaotic workflows."
    consequences << "Potential scope creep – missing Sprint Backlogs may lead to ad-hoc work being introduced without proper prioritization."
    consequences << "Loss of trust – stakeholders and management may question the team's ability to effectively manage work."

    // We'll record which sprints are missing or have empty backlogs
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Gather Sprints
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting sprint backlog check for team '${teamName}'"

    def sprints = teamData.team?.Sprints ?: []

    // ----------------------------------------------------------------------------
    // 3. Check each sprint's SprintBacklog
    // ----------------------------------------------------------------------------
    sprints.each { sprint ->
        def sprintName = sprint.SprintGoal?.Description 
            ? "Sprint starting on '${sprint.StartDate}' with goal '${sprint.SprintGoal.Description}'"
            : "Sprint starting on '${sprint.StartDate}'"

        def sprintBacklogs = sprint.SprintBacklogs ?: []

        if (sprintBacklogs.isEmpty()) {
            symptoms << "${sprintName} has no SprintBacklogs."
        } else {
            sprintBacklogs.eachWithIndex { sb, i ->
                def items = sb.BacklogItems ?: []
                if (items.isEmpty()) {
                    symptoms << "${sprintName} has a SprintBacklog with no BacklogItems."
                }
            }
        }
    }

    // ----------------------------------------------------------------------------
    // 4. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed 
        ? "All Sprints have a non-empty Sprint Backlog." 
        : "One or more Sprints have a missing or empty Sprint Backlog."

    // ----------------------------------------------------------------------------
    // 5. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name                : name,
        definition          : definition,
        categoryID          : categoryID,
        severity            : severity,
        passed              : passed,
        outcomeDescription  : outcomeDescription,
        symptoms            : symptoms,
        possibleRootCauses  : possibleRootCauses,
        possibleConsequences: consequences
    ]
}

// -----------------------------------------------------------------------------
// Main script logic
// -----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy SprintBacklogExists.groovy <path_to_json_file>"
    System.exit(1)
}

// Read and parse the JSON file
def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Execute the evaluation
def result = evaluate(teamData)
System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
