#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether each Sprint has an assigned Product Goal.
 * Fails if any Sprint does not reference a Product Goal.
 *
 * Usage: groovy SprintProductGoal.groovy <path_to_json_file>
 *
 * @param teamData A Map containing, among other things, a "team" object that may have "Sprints".
 * @return A map representing the evaluation result with standard fields.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Sprint Product Goal Check"
    def severityFail = "Major"
    def definition = """
        This check ensures that each sprint is aligned with a Product Goal by verifying
        that every Sprint has a valid ProductGoalID.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 3

    def possibleRootCauses = [
        "Some Sprints were created in the system without specifying an aligned Product Goal.",
        "Product Goal is not set in the system for some reason.",
        "The Product Owner has not clearly communicated or defined that the Product Goal is alligned with each Sprint.",
        "The team lacks awareness of the importance of linking each Sprint to a Product Goal."
    ]

    def consequences = []
    consequences << "Loss of strategic focus – without a Product Goal, the team may work on tasks that do not contribute to the overall product vision."
    consequences << "Reduced transparency – stakeholders and team members may struggle to understand the Sprint’s purpose and expected outcomes."
    consequences << "Misalignment – Sprints without a clear Product Goal may result in fragmented work with little overall impact."
    consequences << "Decreased motivation – team members may feel disconnected from the bigger picture, affecting engagement and productivity."
    consequences << "Stakeholder dissatisfaction – unclear Sprint objectives make it harder for stakeholders to understand product progress."
    consequences << "Potential scope creep – work may be introduced arbitrarily without a guiding objective, leading to uncontrolled expansion."
    consequences << "Loss of trust – failure to align Sprints with clear goals may undermine confidence in the team's ability to deliver meaningful value."
    consequences << "Financial impact – disorganized or misaligned development efforts can lead to inefficient use of resources, missed deadlines, and reduced ROI."

    // We'll record details on any sprints missing a ProductGoalID
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Retrieve sprints and evaluate
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting Sprint Product Goal check for team '${teamName}'"

    def sprints = teamData.team?.Sprints ?: []

    sprints.each { sprint ->
        if (sprint.ProductGoalID == null) {
            def sprintName = sprint.SprintGoal?.Description ? "Sprint starting on '${sprint.StartDate}' with goal '${sprint.SprintGoal.Description}'": "Sprint starting on '${sprint.StartDate}'"
            symptoms << "Sprint '${sprintName}' is missing a ProductGoal."
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed 
        ? "All sprints have an assigned Product Goal."
        : "One or more sprints do not have a Product Goal assigned."

    // ----------------------------------------------------------------------------
    // 4. Return the result
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
    System.err.println "Usage: groovy SprintProductGoal.groovy <path_to_json_file>"
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
