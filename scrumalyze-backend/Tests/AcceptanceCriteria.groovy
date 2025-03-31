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
        providing clarity on understanding that work item has been delivered.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 1

    // Root causes to consider if the evaluation fails
    def possibleRootCauses = []
    possibleRootCauses << "Acceptance Criteria might exist, but they are not properly recorded in the system or are just unspoken."
    possibleRootCauses << "Team does not use Acceptance Criteria for all or some of their work items."
    possibleRootCauses << "Acceptance Criteria exist only as part of the overall 'Definition of Done' rather than being item-specific."
    possibleRootCauses << "Acceptance Criteria exists but in might be lost in work item description and not separetly defined."

    def severityIfFail = "Major"

    def resultPass = "All work items have Acceptance Criteria."
    def resultFail = "Some or all work items are missing Acceptance Criteria."

    def consequences = []
    consequences << "Loss of trust – stakeholders may doubt whether items are truly complete."
    consequences << "Loss of transparency – unclear completion conditions make progress harder to track."
    consequences << "Increased risk of inconsistent quality across work items."
    consequences << "Failure of the team to recognize that the work item can be delivered."
    consequences << "Financial impact and time to market - by fixing things that haven't been delivered and because of wasting time on finished work items (gold plating)."
    consequences << "Increment unbound in iteration - increment may contain non delivered work items."

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
        symptoms << "WorkItem with description '${workItem.description}' is MISSING Acceptance Criteria."
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
