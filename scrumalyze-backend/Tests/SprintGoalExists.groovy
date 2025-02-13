#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether each Sprint has a non-null and non-empty Sprint Goal.
 * Fails if any Sprint's SprintGoal is null or an empty string.
 *
 * Usage: groovy SprintGoalExists.groovy <path_to_json_file>
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
    def name = "Sprint Goal Exists Check"
    def severity = "Critical"
    def descriptionPass = "All Sprints have a non-empty Sprint Goal."
    def descriptionFail = "One or more Sprints have a missing or empty Sprint Goal."

    // ----------------------------------------------------------------------------
    // 2. Gather sprints
    // ----------------------------------------------------------------------------
    def sprints = teamData.team?.Sprints ?: []

    // ----------------------------------------------------------------------------
    // 3. Check each sprint's SprintGoal for null or empty
    // ----------------------------------------------------------------------------
    // We fail if any sprint's SprintGoal is null OR an empty string.
    def anyGoalMissingOrEmpty = sprints.any { sprint ->
        def sprintGoal = sprint.SprintGoal
        // Some data models store the goal as a full object with a "GoalDescription" property.
        // Others might store it as a simple string. Adjust below as needed.
        // For safety, handle both possible structures:
        if (!sprintGoal) {
            // If completely null, definitely fail
            return true
        } else if (sprintGoal instanceof String) {
            // If it's a string, check if it's empty
            return sprintGoal.trim().isEmpty()
        } else if (sprintGoal instanceof Map && sprintGoal.containsKey("GoalDescription")) {
            // Example: "SprintGoal": { "GoalDescription": "..." }
            return !sprintGoal.GoalDescription || sprintGoal.GoalDescription.trim().isEmpty()
        } else {
            // If it's something else, adjust logic if needed. 
            // If we can't confirm it has content, consider it a fail by default.
            return false
        }
    }

    // ----------------------------------------------------------------------------
    // 4. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = !anyGoalMissingOrEmpty
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
    System.err.println "Usage: groovy SprintGoalExists.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
println JsonOutput.toJson(result)
