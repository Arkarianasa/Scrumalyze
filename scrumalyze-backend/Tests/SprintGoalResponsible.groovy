#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that none of the SprintGoals have a single "responsible person" assigned.
 * The idea is that the entire team is collectively responsible for the Sprint Goal,
 * so having an explicitly assigned ResponsiblePerson would fail this check.
 *
 * Usage: groovy SprintGoalResponsible.groovy <path_to_json_file>
 *
 * @param teamData A Map containing, among other things, a "team" object that may have "Sprints".
 *                 Each Sprint may or may not have a "SprintGoal" object with a "ResponsiblePerson".
 * @return A map representing the evaluation result with the standard fields.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Sprint Goal Responsible Check"
    def severityFail = "Major"
    def definition = """
        This check verifies that no Sprint Goal is assigned to a single individual. 
        The entire team should share responsibility for the Sprint Goal.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 2

    def possibleRootCauses = [
        "A single individual was set as 'ResponsiblePerson' to track accountability for Sprint Goals, which counters Scrum principles.",
        "The organization or management requires assigning a specific owner for goals instead of fostering team accountability.",
        "Misinterpretation of Scrum principles led to incorrectly designating an individual as the Sprint Goal owner.",
        "The team is not fully self-organizing and relies on a designated leader to drive Sprint Goals.",
        "Legacy processes from traditional project management approaches influenced the practice of assigning individual accountability."
    ]

    def consequences = []
    consequences << "Loss of team accountability – assigning Sprint Goal responsibility to one person reduces collective ownership."
    consequences << "Weakened self-organization – a single point of responsibility discourages the team from collaboratively driving Sprint success."
    consequences << "Decreased motivation – other team members may disengage, assuming the responsible person will ensure goal completion."
    consequences << "Risk of bottlenecks – having only one person accountable increases dependency and reduces adaptability to challenges."
    consequences << "Stakeholder misalignment – incorrect role expectations may lead stakeholders to communicate only with the assigned individual instead of the full team."
    consequences << "Reduced transparency – focusing responsibility on one individual may obscure the team's collective progress and accountability."
    consequences << "Scrum framework deviation – violating the principle of shared responsibility undermines the effectiveness of Sprint execution."
    consequences << "Loss of trust – management and stakeholders may question the team’s ability to work autonomously and collaboratively."
    consequences << "Financial impact – ineffective Sprint Goal execution due to misaligned ownership can lead to wasted resources, rework, and decreased return on investment."


    // We'll collect specific sprints that have a single responsible person
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Gather sprints
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting SprintGoalResponsible check for team '${teamName}'"

    def sprints = teamData.team?.Sprints ?: []

    // ----------------------------------------------------------------------------
    // 3. Check each sprint's SprintGoal for a ResponsiblePerson
    // ----------------------------------------------------------------------------
    sprints.each { sprint ->
        def sprintGoal = sprint.SprintGoal
        def sprintName = sprint.SprintGoal?.Description ? "Sprint starting on '${sprint.StartDate}' with goal '${sprint.SprintGoal.Description}'": "Sprint starting on '${sprint.StartDate}'"
        if (sprintGoal && (sprintGoal.ResponsiblePerson || sprintGoal.ResponsiblePersonID)) {
            symptoms << "${sprintName} has a responsible person assigned to its SprintGoal."
        }
    }

    // ----------------------------------------------------------------------------
    // 4. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "No SprintGoal has a single responsible person set (team-level responsibility)."
        : "One or more SprintGoals have a responsible person assigned."

    // ----------------------------------------------------------------------------
    // 5. Return the evaluation result
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
    System.err.println "Usage: groovy SprintGoalResponsible.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Run the evaluation
def result = evaluate(teamData)
System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
