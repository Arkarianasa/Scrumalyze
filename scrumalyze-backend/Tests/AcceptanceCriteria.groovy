import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Evaluates the team data (from teamData) for the presence of acceptance criteria.
 *
 * Usage: groovy AcceptanceCriteria.groovy <path_to_json_file>
 *
 * @param teamData A Map containing, among other things, a "team" object and a list of work items ("WorkItems").
 * @return A map representing the evaluation result.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Acceptance Criteria Absence"
    def severity = "Major"
    def descriptionPass = "All work items have Acceptance Criteria."
    def descriptionFail = "Some work items are missing Acceptance Criteria."

    // ----------------------------------------------------------------------------
    // 2. Begin evaluation
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting evaluation for team '${teamName}'"

    def workItemsWithoutAC = teamData.WorkItems.findAll { workItem ->
        System.err.println "Evaluating work item: ${workItem.WorkItemID}"
        // Check if AcceptanceCriterias is null or empty
        !workItem.AcceptanceCriterias || workItem.AcceptanceCriterias.isEmpty()
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = workItemsWithoutAC.isEmpty()
    def outcomeDescription = passed ? descriptionPass : descriptionFail

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name              : name,
        severity          : severity,
        passed            : passed,
        outcomeDescription: outcomeDescription
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

def jsonFilePath = args[0]

// Read and parse the JSON file
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Call the evaluation function
def result = evaluate(teamData)
System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
