#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether each Sprint has a non-null and non-empty SprintGoal.
 * Fails if any Sprint's SprintGoal is null or an empty string.
 *
 * Usage: groovy SprintGoalExists.groovy <path_to_json_file>
 *
 * @param teamData A Map containing a "team" object that may have "Sprints".
 * @return A map (converted to JSON) representing the evaluation result.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Sprint Goal Existence Check"
    def severityFail = "Critical"
    def definition = """
        This check verifies that each Sprint has a clearly defined, non-empty Sprint Goal.
        A missing or empty goal suggests a lack of focus or clarity for the Sprint.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 3

    def possibleRootCauses = [
        "The Sprint Goal was not recorded by the team.",
        "The team does not define Sprint Goals for all or some Sprints.",
        "The team lacks knowledge on how to use Sprint Goals effectively.",
        "The team is using Kanban instead of proper Scrum, hence missing Sprint Goals."
    ]

    def consequences = [
        "The team cannot recognize whether the Sprint has been successfully completed.",
        "The Sprint cannot be properly linked to an Increment.",
        "The team cannot determine if the customer is satisfied.",
        "Loss of transparency in the Sprint process.",
        "Risk that all work done during the Sprint is unnecessary or misaligned.",
        "Loss of trust within the team and with stakeholders.",
        "Financial impact due to inefficiencies and higher costs."
    ]

    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Gather Sprints and evaluate
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting sprint goal check for team '${teamName}'"

    def sprints = teamData.team?.Sprints ?: []

    sprints.each { sprint ->
        def sprintGoal = sprint.SprintGoal
        def sprintName = sprint.SprintGoal?.Description ? "Sprint starting on '${sprint.StartDate}' with goal '${sprint.SprintGoal.Description}'": "Sprint starting on '${sprint.StartDate}'"
        
        // Check if sprintGoal is missing or empty 
        if (!sprintGoal) {
            // Null or falsy
            symptoms << "${sprintName} has a null or missing SprintGoal."
        } else if (sprintGoal instanceof String) {
            // If it's a string, check if it's empty or whitespace
            if (sprintGoal.trim().isEmpty()) {
                symptoms << "${sprintName} has an empty SprintGoal (string)."
            }
        } else if (sprintGoal instanceof Map && sprintGoal.containsKey("GoalDescription")) {
            // If it's a map with a "GoalDescription" key
            def goalDesc = sprintGoal.GoalDescription
            if (!goalDesc || goalDesc.trim().isEmpty()) {
                symptoms << "${sprintName} has an empty 'GoalDescription' in SprintGoal."
            }
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "All Sprints have a non-empty Sprint Goal."
        : "One or more Sprints have a missing or empty Sprint Goal."

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
        possibleConsequences:consequences
    ]
}

// -----------------------------------------------------------------------------
// Main script logic
// -----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy SprintGoalExists.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
