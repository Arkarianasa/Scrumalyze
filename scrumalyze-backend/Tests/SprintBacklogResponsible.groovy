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
        Sprint Backlog. A missing or empty backlog indicates improper planning 
        or incomplete configuration for the sprint.
    """.stripIndent().trim()

    def possibleRootCauses = [
        "Team has not created or assigned a Sprint Backlog for each sprint.",
        "Team is not using sprint backlogs and only works with product backlog."
    ]

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
        def sprintName =  sprint.SprintGoal.Description ?: "that started on " + sprint.StartDate
        def sprintBacklog = sprint.SprintBacklog

        // If backlog is null or empty (if list/map), record a symptom
        if (!sprintBacklog) {
            symptoms << "Sprint '${sprintName}' has no SprintBacklog."
        } else if (sprintBacklog instanceof List) {
            // If it's a list, check if it's empty
            if (sprintBacklog.isEmpty()) {
                symptoms << "Sprint '${sprintName}' has an empty SprintBacklog (list)."
            }
        } else if (sprintBacklog instanceof Map && sprintBacklog.containsKey("Items")) {
            // If it's a map with an 'Items' key, check that those items exist
            def items = sprintBacklog.Items
            if (!items || items.isEmpty()) {
                symptoms << "Sprint '${sprintName}' has an empty 'Items' backlog."
            }
        }
        // If there's another data structure for sprintBacklog, add handling as needed.
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
        name               : name,
        definition         : definition,
        severity           : severity,
        passed             : passed,
        outcomeDescription : outcomeDescription,
        symptoms           : symptoms,
        possibleRootCauses : possibleRootCauses
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
