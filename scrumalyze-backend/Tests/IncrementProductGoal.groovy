#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that every Increment has a ProductGoalID assigned.
 * Fails with severity "Critical" if any Increment has a null ProductGoalID.
 *
 * Usage: groovy IncrementProductGoal.groovy <path_to_json_file>
 */

def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Increment Product Goal Check"
    def severityFail = "Critical"
    def definition = """
        This check ensures every Increment is aligned with a Product Goal.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 3

    def possibleRootCauses = [
        "Team is producing increments that are not related to product goal and therefore non relevant.",
        "Team is not aware that increments needs to be linked to a product goal.",
        "Product goal is not correctly recorded for each increment."
    ]

    // We'll collect which increments fail this check.
    def symptoms = []

    def consequences = []
    consequences << "Loss of product focus – team delivers work that does not contribute to strategic goals."
    consequences << "Loss of transparency – stakeholders struggle to understand how increments support the product vision."
    consequences << "Increased risk of delivering low-value or non-essential functionality."
    consequences << "Failure to maximize business value – time and resources spent on increments that do result in meaningful progress."
    consequences << "Misalignment between the Development Team and Product Owner, leading to conflicting priorities."
    consequences << "Loss of trust – unpredictable product evolution undermines confidence in the team."
    consequences << "Longer time to market – efforts spent on unaligned increments delay delivery of high-impact features."
    consequences << "Technical debt – work on irrelevant increments may cause unnecesary complexity."
    consequences << "Scrum team dysfunction – ineffective Sprint Planning and Review due to unclear alignment with the Product Goal."
    consequences << "Increment unbound in iteration – team struggles to define when meaningful progress has been made."
    
    // ----------------------------------------------------------------------------
    // 2. Retrieve increments and check for ProductGoalID
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting evaluation for team '${teamName}'"

    def increments = teamData.team?.Increments ?: []

    increments.each { inc ->
        if (inc.ProductGoalID == null) {
            // If increment is missing a ProductGoalID, we record that in symptoms
            symptoms << "Increment with description '${inc.Description}' has no ProductGoal."
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "All increments are aligned with a product goal."
        : "One or more increments are not aligned with a product goal."

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
    System.err.println "Usage: groovy IncrementProductGoal.groovy <path_to_json_file>"
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