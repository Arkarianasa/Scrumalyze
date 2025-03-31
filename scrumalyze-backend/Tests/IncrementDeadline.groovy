#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that no Increment has a deadline set.
 * Fails with severity "Minor" if any Increment has a non-null Deadline.
 *
 * Usage: groovy IncrementDeadline.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Increment Deadline Check"
    def severityFail = "Minor"
    def definition = "This check ensures that increments do not have a deadline set."

    // Test Category ID
    categoryID = 4

    def possibleRootCauses = [
        "Team members are using deadlines.",
        "Requirement or contractual obligations led to explicit deadlines on work items.",
        "Deadline for one or more increments has been incorectly recorded in the system."
    ]

    def consequences = []
    consequences << "Loss of agility – fixed deadlines reduce the team's ability to adapt to changing priorities."
    consequences << "Increased stress – team members may feel pressured to meet increment deadline instead of focusing on iterative progress."
    consequences << "Reduced collaboration – deadlines on specific increments may encourage individual-focused work rather than team-based effort."
    consequences << "Misalignment with Scrum principles – work should be planned within Sprints rather than through fixed deadlines."
    consequences << "Risk of cutting corners – rushing to meet arbitrary deadlines may lead to lower-quality deliverables."
    consequences << "Potential for scope creep – individual deadlines may introduce unplanned work outside of Sprint boundaries."
    consequences << "Confusion in Sprint Planning – increments with external deadlines may conflict with Sprint commitments."
    consequences << "Reduced transparency – stakeholders may misunderstand the nature of deadlines, expecting rigid delivery dates instead of iterative progress."
    consequences << "Loss of trust – reliance on deadlines for icrements may indicate a lack of confidence in Scrum’s iterative planning process."

    // We'll collect increments that violate the policy (i.e., have a deadline).
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Gather increments and evaluate
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting evaluation for team '${teamName}'"

    // Retrieve increments
    def increments = teamData.team?.Increments ?: []

    // Check each increment for a non-null deadline
    increments.each { inc ->
        if (inc.Deadline != null) {
            symptoms << "[Increment '${inc.Description ?: 'Unnamed'}'] has a deadline: ${inc.Deadline}."
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "No increments have a deadline set."
        : "One or more increments have a deadline set."

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
    System.err.println "Usage: groovy IncrementDeadline.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)