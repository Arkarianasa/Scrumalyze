#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that every Work Item has a WorkItemType set.
 * Returns a Major severity if any work item is missing its WorkItemType.
 *
 * Usage: groovy WorkitemType.groovy <path_to_json_file>
 *
 * @param teamData A Map containing:
 *   - WorkItems: A list of work items, each possibly with a 'WorkItemType'.
 * @return A map representing the evaluation result with standard fields.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Work Item Type Check"
    def severityFail = "Major"
    def definition = """
        This check ensures that every work item is assigned a valid work item 
        type. Missing or null WorkItemType can lead to confusion about the 
        nature and intended handling of the item.
    """.stripIndent().trim()

    def possibleRootCauses = [
        "Work items were created without specifying a type.",
        "Team members are not aware of the requirement to set a work item type.",
        "Team members are not using work item types."
    ]

    // We'll collect work items that lack a type
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Evaluate all Work Items
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting work item type check for team '${teamName}'"

    def workItems = teamData.WorkItems ?: []
    workItems.each { wi ->
        if (!wi.WorkItemType) {
            // If missing, record a symptom
            def itemDesc = wi.Description ?: "No Description"
            symptoms << "WorkItem '${itemDesc}' does not have a WorkItemType."
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "All work items have a work item type set."
        : "One or more work items do not have a work item type set."

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
    System.err.println "Usage: groovy WorkitemType.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Execute the evaluation
def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)
