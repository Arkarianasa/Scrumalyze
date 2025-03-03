import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Evaluates the team data (from teamData) to check for the presence of
 * acceptance criteria on every work item. Acceptance Criteria are vital to
 * define "done" and provide clear, testable conditions for each work item.
 *
 * Usage: groovy AcceptanceCriteria.groovy <path_to_json_file>
 *
 * @param teamData A Map containing:
 *   - team: An object with details about the team.
 *   - WorkItems: A list of work items, each with a WorkItemID and AcceptanceCriterias.
 * @return A map representing the evaluation result (name, definition, severity,
 *         passed, outcomeDescription, and symptoms).
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Acceptance Criteria Presence Check"
    def definition = """
        This check ensures that every work item has clearly defined Acceptance Criteria.
        Acceptance Criteria specify the conditions, boundaries, and scope of a work item,
        providing clarity on what 'done' means and how functionality can be validated.
    """.stripIndent().trim()

    // Root causes to consider if the evaluation fails
    def possibleRootCauses = []
    possibleRootCauses << "Acceptance Criteria exist, but they are not properly attached to the work item."
    possibleRootCauses << "No one on the team uses or creates Acceptance Criteria for all or some of their tasks."
    possibleRootCauses << "Acceptance Criteria exist only as part of the overall 'Definition of Done' rather than being item-specific."

    // We will adjust severity based on pass/fail
    def severityIfFail = "Major"

    def resultPass = "All work items have Acceptance Criteria."
    def resultFail = "Some work items are missing Acceptance Criteria."

    // We'll collect symptoms for failed work items
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Evaluation Logic
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting evaluation for team '${teamName}'"

    // Find work items with missing Acceptance Criteria
    def workItemsWithoutAC = teamData.WorkItems.findAll { workItem ->
        !workItem.AcceptanceCriterias || workItem.AcceptanceCriterias.isEmpty()
    }

    // Fill in the symptoms array with a note on each failed WorkItem
    workItemsWithoutAC.each { workItem ->
        symptoms << "[WorkItem ${workItem.WorkItemID}] is MISSING Acceptance Criteria."
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = workItemsWithoutAC.isEmpty()
    def outcomeDescription = passed ? resultPass : resultFail
    def severity = passed ? 'None' : severityIfFail

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
        possibleRootCauses: possibleRootCauses
    ]
}

// -----------------------------------------------------------------------------
// Main script logic
// -----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy AcceptanceCriteria.groovy <path_to_json>"
    System.exit(1)
}

// Read and parse the JSON file
def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Call the evaluation function
def result = evaluate(teamData)
System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
