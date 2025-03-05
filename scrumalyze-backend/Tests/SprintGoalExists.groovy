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
    def name = "Sprint Goal Exists Check"
    def severityFail = "Critical"
    def definition = """
        This check ensures that each Sprint has a clearly defined, 
        non-empty Sprint Goal. A missing or empty goal indicates a 
        lack of focus or clarity for that sprint.
    """.stripIndent().trim()

    // Potential explanations for why a SprintGoal might be empty or missing
    def possibleRootCauses = [
        "Sprint Goal was not recorded by the team.",
        "Team does not define Sprint Goals for all or some of their Sprints.",
        "Team does not know how to use Sprint Goals.",
        "Team is using kanban instead of proper SCRUM hence no sprint goal."
    ]

    // We'll collect any sprints that have missing or empty goals
    def symptoms = []

    def consequences = []
    consequences << "Neschopnost týmu rozpoznat, že Sprint je dodán."
    consequences << "Sprint nemuze byt propojen na Increment."
    consequences << "Neschopnost týmu rozpoznat, že zákazník je spokojen."
    consequences << "Ztrata transparentnosti."
    consequences << "Hrozi ze veskera prace v ramci Sprintu je zbytecna / nepotrebna."
    consequences << "Ztrata duvery."
    consequences << "Financni vliv, drazsi reseni."

    // ----------------------------------------------------------------------------
    // 2. Gather Sprints and evaluate
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting sprint goal check for team '${teamName}'"

    def sprints = teamData.team?.Sprints ?: []

    sprints.each { sprint ->
        def sprintGoal = sprint.SprintGoal

        // Check if sprintGoal is missing or empty 
        if (!sprintGoal) {
            // Null or falsy
            symptoms << "Sprint that started '${sprint.StartDate}' has a null or missing SprintGoal."
        } else if (sprintGoal instanceof String) {
            // If it's a string, check if it's empty or whitespace
            if (sprintGoal.trim().isEmpty()) {
                symptoms << "Sprint that started '${sprint.StartDate}' has an empty SprintGoal (string)."
            }
        } else if (sprintGoal instanceof Map && sprintGoal.containsKey("GoalDescription")) {
            // If it's a map with a "GoalDescription" key
            def goalDesc = sprintGoal.GoalDescription
            if (!goalDesc || goalDesc.trim().isEmpty()) {
                symptoms << "Sprint that started '${sprint.StartDate}' has an empty 'GoalDescription' in SprintGoal."
            }
        } else {
            // If it's some other structure we can't verify, mark as questionable
            // Adjust as needed for your data model
            // symptoms << "Sprint '${sprintName}' has a SprintGoal in an unknown format."
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
