#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether each Sprint has a non-null, non-empty Sprint Backlog.
 * Fails if any Sprint's SprintBacklog is null or an empty list.
 *
 * Usage: groovy SprintBacklogExists.groovy <path_to_json_file>
 *
 * @param teamData A Map containing a "team" object that may have "Sprints".
 * @return A map with the following fields:
 *         - name
 *         - severity
 *         - passed
 *         - outcomeDescription
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Define metadata
    // ----------------------------------------------------------------------------
    def name = "Sprint Backlog Exists Check"
    def severity = "Major"
    def descriptionPass = "All Sprints have a non-empty Sprint Backlog."
    def descriptionFail = "One or more Sprints are missing a Sprint Backlog or have an empty one."

    // ----------------------------------------------------------------------------
    // 2. Gather sprints
    // ----------------------------------------------------------------------------
    def sprints = teamData.team?.Sprints ?: []

    // ----------------------------------------------------------------------------
    // 3. Check each sprint's SprintBacklog for null or empty
    // ----------------------------------------------------------------------------
    // We fail if any sprint's SprintBacklog is null OR an empty collection.
    // Adjust if your model has a different property name.
    def anyBacklogMissingOrEmpty = sprints.any { sprint ->
        def sprintBacklog = sprint.SprintBacklog
        if (!sprintBacklog) {
            // If there's no backlog at all, fail
            return true
        }
        // If it's a list, check size
        if (sprintBacklog instanceof List) {
            return sprintBacklog.isEmpty()
        }
        // If it's an object, you might need further checks (like "sprintBacklog.Items").
        // Adjust the following logic to suit your data structure:
        if (sprintBacklog instanceof Map && sprintBacklog.containsKey("Items")) {
            // Example scenario: "SprintBacklog" : { "Items": [...] }
            return !sprintBacklog.Items || sprintBacklog.Items.isEmpty()
        }
        // If none of the above matched, assume it's valid. 
        // Adjust as needed to enforce your data constraints.
        return false
    }

    // ----------------------------------------------------------------------------
    // 4. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = !anyBacklogMissingOrEmpty
    def outcomeDescription = passed ? descriptionPass : descriptionFail

    // ----------------------------------------------------------------------------
    // 5. Return result
    // ----------------------------------------------------------------------------
    return [
        name               : name,
        severity           : severity,
        passed             : passed,
        outcomeDescription : outcomeDescription
    ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
if (args.length < 1) {
    System.err.println "Usage: groovy SprintBacklogExists.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
println JsonOutput.toJson(result)
