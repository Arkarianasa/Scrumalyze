#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether the team's ProductBacklog references a ProductGoal.
 * Fails if:
 *   1) The team has no ProductBacklog, OR
 *   2) The ProductBacklog does not reference a ProductGoal
 *
 * Usage: groovy ProductBacklogGoalCheck.groovy <path_to_json_file>
 *
 * @param teamData A Map with 'team' -> 'ProductBacklog' -> possibly 'ProductGoal'.
 * @return A map representing the evaluation result with standard fields.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Product Backlog Product Goal Check"
    def severityFail = "Major"
    def definition = """
        This check ensures that the team's Product Backlog is properly linked to 
        a Product Goal.
    """.stripIndent().trim()

    def possibleRootCauses = [
        "Team has not defined a Product Goal, or hasn't linked it to the backlog.",
    ]

    // We'll collect details of any issues here
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Retrieve the ProductBacklog and evaluate
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting ProductBacklogGoal check for team '${teamName}'"

    def productBacklog = teamData.team?.ProductBacklog
    if (!productBacklog) {
        // Symptom: no ProductBacklog
        symptoms << "No ProductBacklog found for this team."
    } else {
        // Debug info
        System.err.println "ProductBacklogID: ${productBacklog.ProductBacklogID}"

        // Check if ProductGoal is present
        def hasGoal = (productBacklog.ProductGoal != null) 
        if (!hasGoal) {
            // Symptom: backlog but no goal
            symptoms << "ProductBacklog does not reference a ProductGoal."
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "ProductBacklog references a ProductGoal."
        : "Either no ProductBacklog found or it doesn't reference a ProductGoal."

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
    System.err.println "Usage: groovy ProductBacklogGoalCheck.groovy <path_to_json_file>"
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
