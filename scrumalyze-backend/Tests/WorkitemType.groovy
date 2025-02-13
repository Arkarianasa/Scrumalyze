#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that every Work Item has a WorkItemType set.
 * Returns a Major severity if any work item is missing its WorkItemType.
 *
 * Usage: groovy WorkitemType.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Work Item Type Check"
    def descriptionPass = "All work items have a work item type set."
    def descriptionFail = "One or more work items do not have a work item type set."

    // ----------------------------------------------------------------------------
    // 2. Retrieve work items and evaluate
    // ----------------------------------------------------------------------------
    def workItems = teamData.WorkItems ?: []
    def anyMissingType = workItems.any { wi ->
        // Fails if WorkItemType is null or not set.
        !wi.WorkItemType
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = !anyMissingType
    def severity = passed ? "None" : "Major"
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
    System.err.println "Usage: groovy WorkitemType.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
println JsonOutput.toJson(result)
