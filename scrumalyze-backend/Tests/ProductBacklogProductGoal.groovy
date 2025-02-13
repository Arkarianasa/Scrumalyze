#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether the team's ProductBacklog references a ProductGoal.
 * Fails if:
 *   1) The team has no ProductBacklog, OR
 *   2) The ProductBacklog does not reference a ProductGoal
 *
 * Usage: groovy ProductBacklogGoalCheck.groovy <path_to_json_file>
 *
 * @param teamData A Map with 'team' -> 'ProductBacklog' -> possibly 'ProductGoal'
 * @return A map (converted to JSON) representing the evaluation result
 */

def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Product Backlog Product Goal Check"
    def severity = "Major"
    def descriptionPass = "ProductBacklog references a ProductGoal."
    def descriptionFailNoBacklog = "No ProductBacklog found for this team."
    def descriptionFailNoGoal = "ProductBacklog does not reference a ProductGoal."

    // ----------------------------------------------------------------------------
    // 2. Begin evaluation
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting ProductBacklogGoal check for team '${teamName}'"

    // Retrieve the ProductBacklog node
    def productBacklog = teamData.team?.ProductBacklog
    if (!productBacklog) {
        // If there's no ProductBacklog at all, fail
        return [
            name                   : name,
            severity               : severity,
            passed                 : false,
            descriptionPass        : descriptionPass,
            descriptionFailNoBacklog: descriptionFailNoBacklog,
            descriptionFailNoGoal  : descriptionFailNoGoal,
            outcomeDescription     : descriptionFailNoBacklog
        ]
    }

    // Debug info: see what's inside ProductBacklog
    System.err.println "ProductBacklogID: ${productBacklog.ProductBacklogID}"

    // Check if ProductGoal is present
    def hasGoal = (productBacklog.ProductGoal != null)  // or check productBacklog.ProductGoalID != null

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed, outcomeDescription
    if (!hasGoal) {
        passed = false
        outcomeDescription = descriptionFailNoGoal
    } else {
        passed = true
        outcomeDescription = descriptionPass
    }

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name                   : name,
        severity               : severity,
        passed                 : passed,
        descriptionPass        : descriptionPass,
        descriptionFailNoBacklog: descriptionFailNoBacklog,
        descriptionFailNoGoal  : descriptionFailNoGoal,
        outcomeDescription     : outcomeDescription
    ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy ProductBacklogGoalCheck.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]

// Read and parse the JSON file
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Call the evaluation function
def result = evaluate(teamData)
System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
