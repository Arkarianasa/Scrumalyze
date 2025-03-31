#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that stakeholders communicate directly with the entire Scrum Team.
 * Detects two key failures:
 * 1) Stakeholders communicate only with Scrum Masters or Product Owners, excluding Developers.
 * 2) There are no communication records between stakeholders and Scrum Team members.
 *
 * The script fails if either of these conditions is met.
 *
 * Usage: groovy CommunicationGatekeepingCheck.groovy <path_to_json_file>
 *
 * @param teamData A map containing a "team" object with "Persons" and "Communication" data.
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
    def name = "Communication Gatekeeping Check"
    def severityFail = "Critical"
    def definition = """
        This check ensures that stakeholders communicate directly with the entire Scrum Team.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 2

    def possibleRootCauses = [
        "Stakeholders are only interacting with Scrum Masters or Product Owners, avoiding Developers.",
        "No recorded communication between stakeholders and Scrum Team members.",
        "The organization enforces a hierarchical communication model, discouraging direct interactions.",
        "Lack of transparency in communication, limiting access to stakeholder feedback for Developers."
    ]

    def consequences = [
        "Disrupted feedback loops – the team may receive delayed or filtered feedback, impacting responsiveness.",
        "Loss of customer insight – the team loses direct understanding of customer needs.",
        "Decreased team autonomy – Developers are isolated from stakeholder expectations and feedback.",
        "Risk of misalignment – critical decisions may be made without full team involvement.",
        "Reduced agility – ineffective communication slows decision-making and adaptability." 
    ]

    // ----------------------------------------------------------------------------
    // 2. Analyze Communication Data
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting Communication Gatekeeping check for team '${teamName}'"

    def communications = teamData.Communication ?: []
    def persons = teamData.team?.Persons ?: []
    def developers = persons.findAll { it.Role.RoleName == "Developer" }.collect { it.PersonID }
    def nonDevelopers = persons.findAll { it.Role.RoleName in ["Scrum Master", "Product Owner"] }.collect { it.PersonID }
    def stakeholderIDs = communications.collect { it.SourcePersonID } - persons.collect { it.PersonID }
    def symptoms = []

    def developerCommunicationExists = false
    def onlyNonDeveloperCommunication = false

    communications.each { communication ->
        if (communication.SourcePersonID in stakeholderIDs) {
            if (communication.TargetPersonID in developers) {
                developerCommunicationExists = true
            } else if (communication.TargetPersonID in nonDevelopers) {
                onlyNonDeveloperCommunication = true
            }
        }
    }

    if (!developerCommunicationExists && onlyNonDeveloperCommunication) {
        symptoms << "Stakeholders only communicate with Scrum Masters or Product Owners, excluding Developers."
    }

    if (stakeholderIDs.size() > 0 && communications.findAll { it.SourcePersonID in stakeholderIDs }.isEmpty()) {
        symptoms << "No recorded communication exists between stakeholders and Scrum Team members."
    }

    // ----------------------------------------------------------------------------
    // 3. Evaluation Result
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "Stakeholders communicate effectively with the Scrum Team, including Developers."
        : "One or more issues exist with stakeholder communication, affecting team alignment."

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
    System.err.println "Usage: groovy CommunicationGatekeepingCheck.groovy <path_to_json_file>"
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
