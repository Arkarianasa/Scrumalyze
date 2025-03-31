#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that each backlog item has at least one priority value defined (primary or secondary).
 * Missing priority values may lead to confusion in prioritization and backlog grooming.
 *
 * Usage: groovy BacklogItemPriority.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Backlog Item Priority Check"
    def definition = """
        This check ensures that each backlog item has at least one defined priority value (primary or secondary).
        Missing priorities may disrupt backlog refinement, prioritization, and effective planning.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 1

    def possibleRootCauses = [
        "Some priority values are not correctly set in the system.",
        "Team forgot to assign priority values to some backlog items.",
        "Team does not consistently use prioritization schemes.",
        "Backlog items were created before prioritization practices were introduced."
    ]

    def possibleConsequences = [
        "Lack of clarity on item importance.",
        "Inefficient Sprint Planning due to unclear priorities.",
        "Inconsistent decision-making when selecting work.",
        "Stakeholder dissatisfaction due to misaligned delivery priorities."
    ]

    def symptoms = []
    def severity = "None"

    // ----------------------------------------------------------------------------
    // 2. Evaluate BackItems
    // ----------------------------------------------------------------------------
    def backlogItems = teamData.team?.ProductBacklog?.BacklogItems ?: []

    backlogItems.each { bi ->
        def hasPrimary = bi.PrimaryPriorityValue != null
        def hasSecondary = bi.SecondaryPriorityValue != null
        def itemName = bi.ItemName ?: "Unnamed Item"

        if (!hasPrimary && !hasSecondary) {
            severity = "Major"
            symptoms << "Backlog item '${itemName}' has neither primary nor secondary priority set."
        } else if (!hasPrimary || !hasSecondary) {
            if (severity != "Major") severity = "Minor"
            symptoms << "Backlog item '${itemName}' has only one of the priority values set."
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name                : name,
        definition          : definition,
        categoryID          : categoryID,
        severity            : severity,
        passed              : severity == "None",
        outcomeDescription  : symptoms.isEmpty() ? "All backlog items have complete priority values." : "Some backlog items are missing one or more priority values.",
        symptoms            : symptoms,
        possibleRootCauses  : possibleRootCauses,
        possibleConsequences: possibleConsequences
    ]
}

// -----------------------------------------------------------------------------
// Main script logic
// -----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy BacklogItemPriority.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)
