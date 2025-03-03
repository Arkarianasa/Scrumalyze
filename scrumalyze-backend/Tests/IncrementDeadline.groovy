#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that no Increment has a deadline set.
 * Fails with severity "Minor" if any Increment has a non-null Deadline.
 *
 * Usage: groovy IncrementDeadline.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Increment Deadline Check"
    def severityFail = "Minor"
    def definition = "This check ensures that increments do not have a deadline set."

    def possibleRootCauses = [
        "Team might be confusing SCRUM increments with traditional methods that require explicit deadlines.",
        "Administrators or team members could have automatically set deadlines without noticing."
    ]

    // We'll collect increments that violate the policy (i.e., have a deadline).
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Gather increments and evaluate
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting evaluation for team '${teamName}'"

    // Retrieve increments
    def increments = teamData.team?.Increments ?: []

    // Check each increment for a non-null deadline
    increments.each { inc ->
        if (inc.Deadline != null) {
            symptoms << "[Increment '${inc.Description ?: 'Unnamed'}'] has a deadline: ${inc.Deadline}"
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "No increments have a deadline set."
        : "One or more increments have a deadline set."

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
    System.err.println "Usage: groovy IncrementDeadline.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)