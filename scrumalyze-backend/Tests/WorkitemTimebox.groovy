#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that if a Work Item has a Timebox set, then its WorkItemType must be "Spike".
 * Fails with severity "Minor" if any work item with a Timebox is not of type "Spike".
 *
 * Usage: groovy WorkitemTimebox.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Work Item Timebox Check"
    def descriptionPass = "All work items with a Timebox are of type 'Spike'."
    def descriptionFail = "One or more work items have a Timebox set but are not of type 'Spike'."
    
    // ----------------------------------------------------------------------------
    // 2. Retrieve work items and evaluate
    // ----------------------------------------------------------------------------
    def workItems = teamData.WorkItems ?: []
    
    def violation = workItems.any { wi ->
        if (wi.Timebox) {  // work item has a Timebox set
            def typeName = wi.WorkItemType?.TypeName ?: ""
            return typeName != "Spike"
        }
        return false
    }
    
    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = !violation
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
    System.err.println "Usage: groovy WorkitemTimebox.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
println JsonOutput.toJson(result)
