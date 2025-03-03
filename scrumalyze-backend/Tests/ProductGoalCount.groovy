#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether the team has exactly one ProductGoal.
 * Fails if there are no ProductGoals or if there are multiple ProductGoals.
 *
 * Usage: groovy ProductGoalCheck.groovy <path_to_json_file>
 *
 * @param teamData A Map containing a 'team' object that may include 'ProductGoals'.
 * @return A map representing the evaluation result with standard fields.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Product Goal Count"
    def definition = """
        This check ensures the team has exactly one ProductGoal.
    """.stripIndent().trim()

    def possibleRootCauses = [
        "The team has not defined any Product Goals (0 found).",
        "Multiple product goals have been created and not consolidated into a single overarching goal.",
        "Data is duplicated or incorrectly recorded, resulting in multiple entries for the same goal."
    ]

    // We'll use 'symptoms' to log specific conditions, e.g., zero or multiple goals
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Gather data and evaluate
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting ProductGoal check for team '${teamName}'"

    def productGoals = teamData.team?.ProductGoals ?: []
    System.err.println "Found ${productGoals.size()} ProductGoal(s)."

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = false
    def severity = "None"
    def outcomeDescription = ""

    if (productGoals.size() == 0) {
        passed = false
        severity = "Critical"
        outcomeDescription = "No ProductGoals found."
        symptoms << "Team has zero ProductGoals."
    } else if (productGoals.size() == 1) {
        passed = true
        severity = "None"
        outcomeDescription = "Exactly one ProductGoal is present."
    } else {
        passed = false
        severity = "Major"
        outcomeDescription = "Multiple ProductGoals found."
        symptoms << "Team has ${productGoals.size()} ProductGoals."
    }

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result
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
