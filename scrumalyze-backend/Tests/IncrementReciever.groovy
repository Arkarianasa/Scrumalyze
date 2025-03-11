#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks the receiver for each increment to ensure it is assigned to a non-scrum
 * stakeholder. The rules are:
 *   - If ReceivedBy is null or missing, severity = "Critical"
 *   - If ReceivedBy.IsScrumTeamMember == true, severity = "Major"
 *   - Otherwise, if ReceivedBy exists but the RoleName is not "Stakeholder", severity = "Minor"
 * The overall result is the highest severity found across all increments.
 *
 * Usage: groovy IncrementReceiver.groovy <path_to_json_file>
 *
 * @param teamData A Map that should contain:
 *   - team -> Increments: A list of increments, each with a 'ReceivedBy' field
 *     describing the person or role receiving that increment.
 * @return A map (converted to JSON) with these fields:
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
    def name = "Increment Receiver Check"
    def definition = """
        This check verifies that each increment is received by a non-team member 'Stakeholder'.
    """.stripIndent().trim()

        def possibleRootCauses = [
        "The intended stakeholder is missing or incorrectly recorded as an increment receiver.",
        "A Scrum Team member is incorrectly receiving the increment instead of a stakeholder.",
        "Stakeholder engagement is weak, leading to increments being assigned internally.",
        "Organizational processes do not enforce the correct handoff of increments to stakeholders.",
        "Stakeholder role is differently named or not configured properly."
    ]

    def consequences = []
    consequences << "Loss of transparency – unclear accountability for delivered increments."
    consequences << "Stakeholder disengagement – missing direct feedback from those impacted by the increment."
    consequences << "Risk of internal bias – Scrum Team self-validates increments without external validation."
    consequences << "Reduced product value – increments may not solve real stakeholder needs."
    consequences << "Failure to achieve Sprint Review purpose – missing validation from external stakeholders."
    consequences << "Decreased trust from stakeholders – lack of involvement may cause less satisfaction and resistance to accept the result."
    consequences << "Scrum Team inefficiency – delivering increments without external feedback may lead to wasted effort."
    consequences << "Increment unbounded in iteration – lack of a proper receiver may result in incomplete or unapproved work."


    // We'll record the severity as an integer internally, then map it to a final severity string.
    // Also, we'll store symptoms for each failing increment.
    int severityLevel = 0  // 0=None, 1=Minor, 2=Major, 3=Critical
    def symptoms = []

    // Mapping from severityLevel -> final severity + outcome description
    def severityMapping = [
        0: [
            severity           : "None", 
            outcomeDescription : "All increments have a valid receiver (stakeholder)."
        ],
        1: [
            severity           : "Minor", 
            outcomeDescription : "One or more increments are received by someone who is not a stakeholder."
        ],
        2: [
            severity           : "Major", 
            outcomeDescription : "One or more increments are received by a scrum team member."
        ],
        3: [
            severity           : "Critical", 
            outcomeDescription : "One or more increments have no receiver set."
        ]
    ]

    // ----------------------------------------------------------------------------
    // 2. Retrieve increments
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting receiver check for team '${teamName}'"

    def increments = teamData.team?.Increments ?: []
    if (increments.isEmpty()) {
        // No increments => no issues found
        return [
            name                : name,
            definition          : definition,
            severity            : "None",
            passed              : true,
            outcomeDescription  : "No increments found; skipping check.",
            symptoms            : [],
            possibleRootCauses  : [],
            possibleConsequences: []
        ]
    }

    // ----------------------------------------------------------------------------
    // 3. Evaluate each increment
    // ----------------------------------------------------------------------------
    increments.each { inc ->
        def incDesc = inc.Description ?: "No Description"

        if (!inc.ReceivedBy) {
            // Critical
            severityLevel = Math.max(severityLevel, 3)
            symptoms << "Increment with description '${incDesc}' has no receiver set."
        } else {
            // Check if scrum team member
            if (inc.ReceivedBy.IsScrumTeamMember == true) {
                // Major
                severityLevel = Math.max(severityLevel, 2)
                symptoms << "Increment with description '${incDesc}' is received by a scrum team member."
            } else {
                // Check if 'Stakeholder'
                def roleName = inc.ReceivedBy?.Role?.RoleName ?: ""
                if (roleName != "Stakeholder") {
                    // Minor
                    severityLevel = Math.max(severityLevel, 1)
                    symptoms << "Increment with description '${incDesc}' is received by a non-stakeholder role: '${roleName}'."
                }
            }
        }
    }

    // ----------------------------------------------------------------------------
    // 4. Determine final severity and pass/fail
    // ----------------------------------------------------------------------------
    def resultMapping       = severityMapping[severityLevel]
    def finalSeverity       = resultMapping.severity
    def outcomeDescription  = resultMapping.outcomeDescription
    def passed              = (severityLevel == 0)

    // ----------------------------------------------------------------------------
    // 5. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name                : name,
        definition          : definition,
        severity            : finalSeverity,
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
    System.err.println "Usage: groovy IncrementReceiver.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Evaluate
def result = evaluate(teamData)
System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
