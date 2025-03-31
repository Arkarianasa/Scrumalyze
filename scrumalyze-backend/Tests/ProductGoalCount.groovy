#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether the team has exactly one ProductGoal.
 * Fails if there are no ProductGoals or if there are multiple ProductGoals.
 *
 * Usage: groovy ProductGoalCheck.groovy <path_to_json_file>
 *
 * @param teamData A Map containing a 'team' object that may include 'ProductGoals'.
 * @return A map representing the evaluation result with standard fields.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Product Goal Count"
    def definition = """
        This check ensures the team has exactly one ProductGoal.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 1

    def possibleRootCauses = [
        "There is not defined any Product Goal.",
        "Multiple product goals have been defined and not consolidated into a single overarching goal.",
        "Data is duplicated or incorrectly recorded, resulting in multiple entries for the same goal.",
        "The team is working on two or more separate product goals without clear distinction.",
        "Stakeholders or management have introduced multiple competing goals without proper alignment."
    ]

    def consequences = []
    consequences << "Loss of focus – without a single Product Goal, the team may work in multiple, conflicting directions."
    consequences << "Reduced transparency – stakeholders and the team may struggle to understand the product's strategic direction."
    consequences << "Misalignment – team efforts may become scattered, leading to inefficiencies and wasted resources."
    consequences << "Inconsistent prioritization – unclear goals make it difficult to determine what work is most valuable."
    consequences << "Stakeholder confusion – unclear or multiple goals may lead to miscommunication about the product’s vision."
    consequences << "Scope creep – without a single guiding goal, uncontrolled feature additions may dilute product focus."
    consequences << "Delays and inefficiencies – team may waste time debating priorities rather than making meaningful progress."
    consequences << "Financial impact – misaligned development efforts may lead to increased costs with lower value delivery."

    // We'll use 'symptoms' to log specific conditions, e.g., zero or multiple goals
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Gather data and evaluate
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting ProductGoal check for team '${teamName}'"

    def productGoals = teamData.team?.ProductGoals ?: []
    System.err.println "Found ${productGoals.size()} ProductGoal(s)."

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = false
    def severity = "None"
    def outcomeDescription = ""

    if (productGoals.size() == 0) {
        passed = false
        severity = "Critical"
        outcomeDescription = "No ProductGoals found."
        symptoms << "Team has zero Product Goals."
    } else if (productGoals.size() == 1) {
        passed = true
        severity = "None"
        outcomeDescription = "Exactly one Product Goal is present."
    } else {
        passed = false
        severity = "Major"
        outcomeDescription = "Multiple ProductGoals found."
        symptoms << "Team has ${productGoals.size()} Product Goals."
    }

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
    System.err.println "Usage: groovy ProductGoalCheck.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Perform the check
def result = evaluate(teamData)

System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
