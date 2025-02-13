#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether the team has exactly one ProductGoal.
 * Fails if there are no ProductGoals or if there are multiple ProductGoals.
 *
 * Usage: groovy ProductGoalCheck.groovy <path_to_json_file>
 *
 * @param teamData A Map containing, among other things, a "team" object that has "ProductGoals".
 * @return A map representing the evaluation result.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Define metadata
    // ----------------------------------------------------------------------------
    def name = "Product Goal Count"
    def severityNone = "Critical"
    def severityMultiple = "Major"
    def descriptionPass = "Exactly one ProductGoal is present."
    def descriptionFailNone = "No ProductGoals found."
    def descriptionFailMultiple = "Multiple ProductGoals found."

    // ----------------------------------------------------------------------------
    // 2. Begin the evaluation
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting ProductGoal check for team '${teamName}'"

    // Retrieve the product goals array (if any)
    def productGoals = teamData.team?.ProductGoals ?: []
    System.err.println "Found ${productGoals.size()} ProductGoal(s)."

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed
    def outcomeDescription
    def outcomeSeverity = "None"

    if (productGoals.size() == 0) {
        passed = false
        outcomeDescription = descriptionFailNone
        outcomeSeverity = severityNone
    } else if (productGoals.size() == 1) {
        passed = true
        outcomeDescription = descriptionPass
    } else {
        passed = false
        outcomeDescription = descriptionFailMultiple
        outcomeSeverity = severityMultiple
    }

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result as a map
    // ----------------------------------------------------------------------------
    return [
        name                   : name,
        severity               : outcomeSeverity,
        passed                 : passed,
        outcomeDescription     : outcomeDescription
    ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy ProductGoalCheck.groovy <path_to_json_file>"
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
