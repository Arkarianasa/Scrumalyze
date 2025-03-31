#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that every ended Sprint has at least one completed Increment.
 *
 * A Sprint is considered "ended" if it has a non-null EndDate.
 * A completed Increment is one where Increment.Done == true and it is linked to the Sprint.
 *
 * Usage: groovy SprintIncrementDone.groovy <path_to_json_file>
 *
 * @param teamData A map containing a Scrum Team, its Sprints, and Increments.
 * @return A result map with:
 *         - name
 *         - definition
 *         - severity
 *         - passed
 *         - outcomeDescription
 *         - symptoms
 *         - possibleRootCauses
 *         - possibleConsequences
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Sprint Increment Completion Check"
    def severityFail = "Critical"
    def definition = """
        This check ensures that every Sprint that has ended (has an End Date)
        results in at least one Increment that is marked as Done.
        Sprints without completed increments may indicate a delivery failure.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 3

    def possibleRootCauses = [
        "The team completed the Sprint but forgot to mark any Increment as done.",
        "Work in the Sprint did not result in a releasable product increment.",
        "The team misunderstood the definition of Increment in Scrum.",
        "The team didn't align their work toward delivering a usable increment."
    ]

    def possibleConsequences = [
        "Misleading progress reports – it appears that the team delivered value, but no usable increment exists.",
        "Loss of stakeholder trust – especially if increments are expected after each Sprint.",
        "Breakdown in empirical process control – without a done increment, inspection and adaptation are compromised.",
        "Sprint Goal is unfulfilled – the Sprint may not deliver any value to users or customers."
    ]

    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Evaluation
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Checking sprint-to-increment completion for team '${teamName}'"

    def sprints = teamData.team?.Sprints ?: []
    def increments = teamData.team?.Increments ?: []

    sprints.findAll { it.EndDate }.each { sprint ->
        def sprintID = sprint.SprintID
        def doneIncrements = increments.findAll { it.SprintID == sprintID && it.Done == true }

        if (doneIncrements.isEmpty()) {
            symptoms << "Sprint that started '${sprint.StartDate}' has ended but has no completed increments."
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Result
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "All ended sprints have at least one completed increment."
        : "One or more ended sprints have no completed increment."

    return [
        name                : name,
        definition          : definition,
        categoryID          : categoryID,
        severity            : severity,
        passed              : passed,
        outcomeDescription  : outcomeDescription,
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
    System.err.println "Usage: groovy SprintIncrementDone.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)
