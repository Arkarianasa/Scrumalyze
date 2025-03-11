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
        "The team has not defined a Product Goal.",
        "Product Goal exists but is not correctly recorded or linked to the Product Backlog.",
        "The team is working on backlog items without a clear overarching Product Goal.",
        "Product Owner has failed and doesn't understand the importance of linking backlog items to a Product Goal."
    ]

    todo
    def consequences = []
    consequences << "Loss of strategic direction – backlog items may not contribute to long-term objectives."
    consequences << "Reduced transparency – stakeholders cannot see how backlog items creates product value."
    consequences << "Increased risk of misalignment – team may work on low-priority or irrelevant backlog items."
    consequences << "Ineffective Sprint Planning – backlog lacks a clear vision, making prioritization difficult."
    consequences << "Stakeholder dissatisfaction – unclear product vision may lead to misaligned expectations."
    consequences << "Failure to deliver maximum value – backlog may include work that does not support business outcomes."
    consequences << "Scrum Team inefficiency – team may waste time on tasks that do not advance the product."
    consequences << "Potential scope creep – work expands without a structured vision to guide prioritization."
    consequences << "Increment unbounded in iteration – team struggles to define what success looks like for each sprint."

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
        name                : name,
        definition          : definition,
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
