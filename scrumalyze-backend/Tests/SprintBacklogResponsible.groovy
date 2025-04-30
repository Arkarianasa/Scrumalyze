#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that no individual is assigned as the responsible person for the Sprint Backlog.
 * The entire Scrum Team should be responsible collectively.
 *
 * The script will fail if any Sprint Backlog has a designated individual responsible.
 *
 * Usage: groovy SprintBacklogCheck.groovy <path_to_json_file>
 *
 * @param teamData A map containing a "team" object with "Sprints".
 * @return A map with the following values:
 *         - name
 *         - definition
 *         - severity
 *         - passed
 *         - outcomeDescription
 *         - symptoms
 *         - possibleRootCauses
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Sprint Backlog Responsibility Check"
    def severityFail = "Major"
    def definition = """
        This check verifies that no Sprint Backlog is assigned to a single individual.
        The entire Scrum Team should share responsibility for managing the Sprint Backlog.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 2

    def possibleRootCauses = [
        "A single individual was incorrectly set as 'ResponsiblePerson' for the Sprint Backlog.",
        "The organization or management enforces a designated owner rather than team accountability.",
        "Misinterpretation of Scrum principles led to assigning an individual responsibility for backlog management.",
        "The team is not fully self-organizing and relies on a designated leader for backlog decisions.",
        "Legacy project management processes influenced the practice of assigning backlog responsibility."
    ]

    def consequences = [
        "Loss of team accountability – assigning Sprint Backlog responsibility to one person reduces collective ownership.",
        "Weakened self-organization – a single point of responsibility discourages team-wide backlog management.",
        "Decreased motivation – team members may disengage, assuming the assigned individual will manage the backlog.",
        "Risk of bottlenecks – a single responsible person increases dependency and reduces adaptability.",
        "Stakeholder misalignment – stakeholders may communicate with only the assigned individual instead of the team.",
        "Reduced transparency – centralizing backlog responsibility may obscure the team's collective contributions.",
        "Deviation from Scrum principles – undermining shared responsibility weakens Sprint execution effectiveness.",
        "Loss of trust – management and stakeholders may question the team’s ability to work autonomously.",
        "Financial impact – ineffective backlog management may lead to wasted effort and increased costs."
    ]

    // ----------------------------------------------------------------------------
    // 2. Validate Sprints
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting Sprint Backlog responsibility check for team '${teamName}'"

    def sprints = teamData.team?.Sprints ?: []
    def symptoms = []

    sprints.each { sprint ->
        def sprintName = sprint.SprintGoal?.Description
            ? "Sprint starting on '${sprint.StartDate}' with goal '${sprint.SprintGoal.Description}'"
            : "Sprint starting on '${sprint.StartDate}'"

        def sprintBacklogs = sprint.SprintBacklogs ?: []

        sprintBacklogs.eachWithIndex { sb, i ->
            def responsible = sb?.ResponsiblePerson
            if (responsible) {
                def personName = responsible.FirstName + " " + responsible.LastName
                symptoms << "${sprintName} has an individual ('${personName}') assigned as responsible for the Sprint Backlog, violating Scrum principles."
            }
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Evaluation Result
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "All Sprint Backlogs are managed collectively by the Scrum Team."
        : "One or more Sprint Backlogs have an individual assigned as responsible, violating Scrum principles."

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
// Main Script Logic
// -----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy SprintBacklogCheck.groovy <path_to_json_file>"
    System.exit(1)
}

// Read and parse the JSON file
def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Execute the evaluation
def result = evaluate(teamData)
System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
