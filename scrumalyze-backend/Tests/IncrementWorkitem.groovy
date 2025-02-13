#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that all work items associated with an increment are marked as done.
 *
 * Rules:
 * - For each WorkItem, if WorkItem.Increment is nor null AND WorkItem.Done is not true,
 *   then the check fails with severity "Critical".
 *
 * Usage: groovy IncrementWorkitem.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Increment Work Item Done Check"
    def descriptionPass = "All work items in increments are marked as done."
    def descriptionFail = "One or more work items that is in increment is not marked as done."

    // ----------------------------------------------------------------------------
    // 2. Retrieve WorkItems and evaluate
    // ----------------------------------------------------------------------------
    def workItems = teamData.WorkItems ?: []
    def violation = workItems.any { wi ->
        // If the work item is  in an increment, then Its Done flag must be true.
        (wi.Increment) && (wi.Done != true)
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = !violation
    def severity = passed ? "None" : "Critical"
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
    System.err.println "Usage: groovy IncrementWorkitem.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
println JsonOutput.toJson(result)
