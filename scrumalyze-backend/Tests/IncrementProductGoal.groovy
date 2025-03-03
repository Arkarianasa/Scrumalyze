#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that every Increment has a ProductGoalID assigned.
 * Fails with severity "Critical" if any Increment has a null ProductGoalID.
 *
 * Usage: groovy IncrementProductGoal.groovy <path_to_json_file>
 */

def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Increment Product Goal Check"
    def severityFail = "Critical"
    def definition = """
        This check ensures every Increment is aligned with a Product Goal by verifying
        that each Increment has a valid (non-null) ProductGoal assigned.
    """.stripIndent().trim()

    def possibleRootCauses = [
        "ProductGoal was never set or recorded in the system for some increments.",
        "Team is not aware that increments need to be linked to a product goal."
    ]

    // We'll collect which increments fail this check.
    def symptoms = []
    
    // ----------------------------------------------------------------------------
    // 2. Retrieve increments and check for ProductGoalID
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting evaluation for team '${teamName}'"

    def increments = teamData.team?.Increments ?: []

    increments.each { inc ->
        if (inc.ProductGoalID == null) {
            // If increment is missing a ProductGoalID, we record that in symptoms
            symptoms << "[Increment '${inc.Description}'] has no ProductGoal."
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "All increments are aligned with a product goal."
        : "One or more increments are not aligned with a product goal."

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
    System.err.println "Usage: groovy IncrementProductGoal.groovy <path_to_json_file>"
    System.exit(1)
}

// Read and parse the JSON file
def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Call the evaluation function
def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)