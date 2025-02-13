#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that no Work Item has a deadline.
 * Fails with severity "Minor" if any work item has a set deadline.
 *
 * Usage: groovy WorkItemDeadline.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Work Item Deadline Check"
    def descriptionPass = "No work items have a set deadline."
    def descriptionFail = "One or more work items have a deadline set."

    // ----------------------------------------------------------------------------
    // 2. Retrieve work items and evaluate
    // ----------------------------------------------------------------------------
    def workItems = teamData.WorkItems ?: []
    def anyHasDeadline = workItems.any { wi ->
        // Check that Deadline is non-null and not an empty string
        wi.Deadline && wi.Deadline.toString().trim() != ""
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = !anyHasDeadline
    def severity = passed ? "None" : "Minor"
    def outcomeDescription = passed ? descriptionPass : descriptionFail

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name               : name,
        severity           : severity,
        passed             : passed,
        outcomeDescription : outcomeDescription,
    ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
if (args.length < 1) {
    System.err.println "Usage: groovy WorkItemDeadline.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
println JsonOutput.toJson(result)
