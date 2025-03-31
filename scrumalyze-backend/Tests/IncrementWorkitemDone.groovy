#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that all work items associated with a completed increment
 * are also marked as done.
 *
 * If any work item is part of an increment that is marked as done,
 * but the work item itself is not marked as done, the check fails.
 *
 * Usage: groovy IncrementWorkitemDone.groovy <path_to_json_file>
 *
 * @param teamData A map containing team metadata and a list of work items.
 * @return A result map including:
 *         - name
 *         - definition
 *         - severity
 *         - passed
 *         - outcomeDescription
 *         - symptoms
 *         - possibleRootCauses
 *         - possibleConsequences
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Increment Completion Consistency Check"
    def severityFail = "Critical"
    def definition = """
        This check ensures that all work items linked to a completed increment
        are also marked as done. If any work item remains unfinished while
        its increment is marked complete, this represents a gap in delivery integrity.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 3

    def possibleRootCauses = [
        "The team forgot to update the 'Done' status for some work items.",
        "Incomplete work was mistakenly included in a completed increment.",
        "Poor tracking of work item status within the increment lifecycle.",
        "Lack of definition of 'Done' being properly applied across work items."
    ]

    def possibleConsequences = [
        "Inaccurate reporting of completed functionality.",
        "Stakeholders may assume work is done when it is not.",
        "Increments delivered with hidden technical debt or incomplete work.",
        "Loss of trust in the team's ability to deliver finished features."
    ]

    // ----------------------------------------------------------------------------
    // 2. Retrieve WorkItems and evaluate
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting evaluation for team '${teamName}'"

    def workItems = teamData.WorkItems ?: []
    def symptoms = []

    workItems.each { wi ->
        // If the work item's increment is done, the work item must also be done
        if (wi.Increment?.Done && !wi.Done) {
            def itemDescription = wi.Description ?: "Unnamed WorkItem"
            symptoms << "WorkItem '${itemDescription}' is part of a completed increment but is not marked as done."
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed 
        ? "All work items in completed increments are correctly marked as done."
        : "One or more work items in completed increments are not marked as done."

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name                 : name,
        definition           : definition,
        categoryID           : categoryID,
        severity             : severity,
        passed               : passed,
        outcomeDescription   : outcomeDescription,
        symptoms             : symptoms,
        possibleRootCauses   : possibleRootCauses,
        possibleConsequences : possibleConsequences
    ]
}

// -----------------------------------------------------------------------------
// Main script logic
// -----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy IncrementWorkitemDone.groovy <path_to_json_file>"
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
