#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that if a Work Item has a Timebox set, then its WorkItemType must be "Spike".
 * Fails with severity "Minor" if any work item with a Timebox is not of type "Spike".
 *
 * Usage: groovy WorkitemTimebox.groovy <path_to_json_file>
 *
 * @param teamData A Map with:
 *   - WorkItems: A list of work items, each potentially with a 'Timebox' and 'WorkItemType'.
 * @return A map representing the evaluation result with standard fields.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Work Item Timebox Check"
    def severityFail = "Minor"
    def definition = """
        This check ensures that only 'Spike' work items are placed under a Timebox.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 4

    def possibleRootCauses = [
        "The team may be adding Timeboxes to regular stories or tasks unintentionally.",
        "Work items requiring additional research (Spikes) are not being labeled correctly.",
        "The team does not have a clear understanding of what a Spike is and when it should be used.",
        "Lack of proper guidelines for when to assign a Timebox to a work item."
    ]

    def consequences = []
    consequences << "Loss of process consistency – incorrect use of Timeboxes can disrupt the intended Scrum framework."
    consequences << "Reduced transparency – stakeholders and the team may misunderstand why certain work items are time-limited."
    consequences << "Potential delays – using Timeboxes improperly may limit flexibility in addressing work items."
    consequences << "Misallocation of resources – development efforts may be incorrectly prioritized based on artificial constraints."
    consequences << "Stakeholder misalignment – incorrect use of Timeboxes may cause confusion about research efforts versus regular development."
    consequences << "Loss of trust – stakeholders and management may lose confidence in the team's ability to structure work effectively."


    // Collect any non-Spike items that have a Timebox
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Evaluate all Work Items
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting timebox check for team '${teamName}'"

    def workItems = teamData.WorkItems ?: []
    workItems.each { wi ->
        if (wi.Timebox) {
            // If item has a Timebox, check that WorkItemType == "Spike"
            def itemType = wi.WorkItemType?.TypeName ?: ""
            if (itemType != "Spike") {
                def itemDesc = wi.Description ?: "No Description"
                symptoms << "WorkItem '${itemDesc}' has a Timebox but is not of type 'Spike'."
            }
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "All work items with a Timebox are of type 'Spike'."
        : "One or more work items have a Timebox set but are not of type 'Spike'."

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name                : name,
        definition          : definition,
        categoryID          : categoryID,
        severity            : severity,
        passed              : passed,
        outcomeDescription  : outcomeDescription,
        symptoms            : symptoms,
        possibleRootCauses  : possibleRootCauses,
        possibleConsequences: consequences
    ]
}

// -----------------------------------------------------------------------------
// Main script logic
// -----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy WorkitemTimebox.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Execute the evaluation
def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)
