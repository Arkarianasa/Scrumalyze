#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that all work items associated with an increment are marked as done.
 *
 * Rules:
 * - For each WorkItem, if WorkItem.Increment is not null AND WorkItem.Done is not true,
 *   then the check fails with severity "Critical".
 *
 * Usage: groovy IncrementWorkitem.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = " Check of Increment's Work Item"
    def severityFail = "Critical"
    def definition = """
        This check verifies that any work item linked to an increment is marked as 
        'Done'. Missing the 'Done' flag on these items can indicate unfinished 
        work that should have been completed as part of the increment.
    """.stripIndent().trim()

    def possibleRootCauses = [
        "Team forgot to update the 'Done' status for work items in an increment.",
        "Unfinished Work items are part of an increment."
    ]

    // We'll collect which work items fail the check.
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Retrieve WorkItems and evaluate
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting evaluation for team '${teamName}'"

    def workItems = teamData.WorkItems ?: []
    workItems.each { wi ->
        // If the work item is in an increment but is not marked done, it's a failure.
        if (wi.Increment && wi.Done != true) {
            // Use the WorkItemID or another identifying field to describe it
            def itemId = wi.WorkItemID ?: "Unknown ID"
            symptoms << "[WorkItem ${itemId}] is in an increment but not marked as done."
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed 
        ? "All work items in increments are marked as done."
        : "One or more work items in increments are not marked as done."

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
    System.err.println "Usage: groovy IncrementWorkitem.groovy <path_to_json_file>"
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
