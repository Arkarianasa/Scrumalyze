#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that every Increment has a SprintID assigned.
 * Fails with severity "Major" if any Increment has a null SprintID.
 *
 * Usage: groovy IncrementSprint.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Increment Sprint Check"
    def severityFail = "Major"
    def definition = """
        This check ensures that every Increment is tied to a Sprint and it's goal.
        Any Increment missing related Sprint is considered an issue because it indicates
        a lack of clear linkage between the planned work and the current sprint timeline.
    """.stripIndent().trim()

    def possibleRootCauses = [
        "Related sprint is not correctly recorded in all or some of Increments.",
        "todo"
    ]

    // We'll collect which increments fail this check.
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Retrieve increments and evaluate
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting evaluation for team '${teamName}'"

    def increments = teamData.team?.Increments ?: []

    // Identify increments with null SprintID
    increments.each { inc ->
        if (inc.SprintID == null) {
            // Record this increment as a failure
            symptoms << "[Increment '${inc.Description ?: 'No Description'}'] has no Sprint assigned."
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "All increments are related to a Sprint."
        : "One or more increments are not related to a Sprint."

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
    System.err.println "Usage: groovy IncrementSprint.groovy <path_to_json_file>"
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
