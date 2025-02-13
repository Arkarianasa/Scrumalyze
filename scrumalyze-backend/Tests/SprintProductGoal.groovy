#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether each Sprint has an assigned Product Goal.
 * Fails if any Sprint does not reference a Product Goal.
 *
 * Usage: groovy SprintProductGoal.groovy <path_to_json_file>
 *
 * @param teamData A Map containing, among other things, a "team" object that may have "Sprints".
 * @return A map representing the evaluation result.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Define metadata
    // ----------------------------------------------------------------------------
    def name = "Sprint Product Goal Check"
    def severity = "Major"
    def descriptionPass = "All sprints have an assigned Product Goal."
    def descriptionFail = "One or more sprints do not have a Product Goal assigned."

    // ----------------------------------------------------------------------------
    // 2. Retrieve sprints and evaluate
    // ----------------------------------------------------------------------------
    def sprints = teamData.team?.Sprints ?: []
    def anyMissing = sprints.any { sprint ->
        // If no ProductGoalID is set, consider it missing
        sprint.ProductGoalID == null
    }

    def passed = !anyMissing
    def outcomeDescription = passed ? descriptionPass : descriptionFail

    // ----------------------------------------------------------------------------
    // 3. Return the result
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
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy SprintProductGoal.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Perform the check
def result = evaluate(teamData)
System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
