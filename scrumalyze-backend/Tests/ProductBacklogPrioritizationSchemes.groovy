#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that the Product Backlog has both a primary and secondary prioritization scheme.
 * These are required for consistent prioritization of backlog items.
 *
 * Usage: groovy ProductBacklogPrioritizationSchemes.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Product Backlog Prioritization Scheme Check"
    def definition = """
        This check verifies that the product backlog has both a primary and secondary
        prioritization scheme defined. Lack of these can hinder consistent prioritization
        and decision-making in planning meetings.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 1

    def possibleRootCauses = [
        "Prioritization schemes are not correctly set in the system.",
        "Only one prioritization scheme was considered necessary during setup.",
        "The team is not using prioritization strategies at all."
    ]

    def possibleConsequences = [
        "Inconsistent prioritization of backlog items.",
        "Reduced effectiveness of Sprint Planning.",
        "Lack of alignment with business or customer needs.",
        "Difficulty handling prioritization during refinement and planning."
    ]

    def symptoms = []
    def severity = "None"

    // ----------------------------------------------------------------------------
    // 2. Evaluate ProductBacklog
    // ----------------------------------------------------------------------------
    def pb = teamData.team?.ProductBacklog

    if (pb != null) {
        def hasPrimary = pb.PrimaryPrioritizationSchemeID != null
        def hasSecondary = pb.SecondaryPrioritizationSchemeID != null

        if (!hasPrimary && !hasSecondary) {
            severity = "Major"
            symptoms << "Product backlog has no prioritization schemes defined."
        } else if (!hasPrimary || !hasSecondary) {
            severity = "Minor"
            symptoms << "Product backlog has only one prioritization scheme defined."
        }
    } else {
        severity = "Major"
        symptoms << "No product backlog found in team data."
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
        outcomeDescription  : symptoms.isEmpty() ? "Product backlog has complete prioritization configuration." : "Product backlog prioritization configuration is incomplete.",
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
    System.err.println "Usage: groovy ProductBacklogPrioritizationSchemes.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)
