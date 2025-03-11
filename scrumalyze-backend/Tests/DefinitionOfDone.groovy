#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks the consistency of Definitions of Done (DoD) across all Work Items.
 * 
 * Rules:
 * 1) Major failure if any Work Item has zero DefinitionsOfDone or all are null/empty.
 * 2) Critical failure if DoD sets differ among Work Items.
 * 3) Otherwise, pass with severity = "None".
 *
 * Usage: groovy DefinitionOfDone.groovy <path_to_json_file>
 *
 * @param teamData A Map containing:
 *   - team: An object with details about the team (e.g., TeamName).
 *   - WorkItems: A list of work items, each potentially having DefinitionsOfDone (list).
 * @return A map representing the evaluation result with fields:
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
    def name = "Definition of Done Consistency Check"
    def definition = """
        This check verifies that each Work Item has non-empty, consistent Definitions of
        Done (DoD). A DoD ensures a clear and shared understanding when work item is done.
    """.stripIndent().trim()

    def possibleRootCauses = []
    possibleRootCauses << "Definition of Done exists, but they are not properly recorded in the system."
    possibleRootCauses << "Team does not use Definitions of Done for all or some of their work items."
    possibleRootCauses << "Definitions of Done exist only as part of the item-specific 'Acceptance Criteria'."
    possibleRootCauses << "Team is not consistent in using of Definitions Of Done or does not understand them."

    // We’ll store ‘symptoms’ of each failure here
    def symptoms = []

    // We have two potential failure severities:
    // - Major if some items have zero or all-empty DoDs
    // - Critical if DoDs differ among items (assuming no Major issues)
    // We track them separately and decide final severity after the checks.
    def majorFailures = false
    def criticalFailures = false

    def majorOutcomeDescription = "One or more work items have missing or null/empty Definitions of Done."
    def criticalOutcomeDescription = "Definitions of Done differ among one or more work items."

    // Helper messages
    def resultPass = "All work items have consistent, non-empty Definitions of Done."
    // We’ll refine final fail message once we know if it’s Major or Critical.

    def consequences = []
    consequences << "Loss of trust."
    consequences << "Loss of transparency."
    consequences << "Increased risk of inconsistent quality across work items."
    consequences << "Failure of the team to recognize that the work item is done."
    consequences << "Technical debt threatens to accumulate. There may be definitions of done that would prevent it."
    consequences << "Increment unbounded in iteration - increment may contain non done work items."
    consequences << "Financial impact and time problems - because of fixing things that weren’t truly done and by wasting time on done work items (gold plating)."

    // ----------------------------------------------------------------------------
    // 2. Evaluation Logic
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting evaluation for team '${teamName}'"

    // Get work items
    def workItems = teamData.WorkItems ?: []
    if (workItems.isEmpty()) {
        // If no work items at all, return a pass with a note
        return [
            name                : name,
            definition          : definition,
            severity            : "None",
            passed              : true,
            outcomeDescription  : "No work items found; skipping check.",
            symptoms            : [],
            possibleRootCauses  : possibleRootCauses
        ]
    }

    // We'll store sets of DoD constraint descriptions to check if they differ
    def listOfDoDSets = []

    // Check for missing or null/empty DoDs in each Work Item
    workItems.each { wi ->
        def definitions = wi.DefinitionsOfDone ?: []

        if (!definitions || definitions.isEmpty()) {
            majorFailures = true
            symptoms << "WorkItem with description '${wi.description}' has no Definitions of Done."
            // Even though we found a major failure, we continue checking others
            // to gather full list of failing items
        } else {
            // Collect constraint descriptions (trimmed, ignoring null/empty)
            def descSet = definitions.collect {
                it.DefinitionOfDone?.ConstraintDescription?.trim()
            }.findAll { it }

            if (descSet.isEmpty()) {
                majorFailures = true
                symptoms << "WorkItem with description '${wi.description}' has only null or empty DoD descriptions."
            } else {
                // Keep track for consistency check
                listOfDoDSets << descSet
            }
        }
    }

    if (!majorFailures && listOfDoDSets.size() > 1) {
        // Convert the list of sets into a Set of sets to see if there's more than 1 distinct entry
        def distinctSets = listOfDoDSets.collect { new TreeSet(it) }.toSet()
        if (distinctSets.size() > 1) {
            criticalFailures = true
            symptoms << "Definitions of Done differ across multiple work items."
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = !(majorFailures || criticalFailures)
    def severity = 'None'
    def outcomeDescription = resultPass

    if (majorFailures) {
        severity = 'Major'
        outcomeDescription = majorOutcomeDescription

    }
    if (criticalFailures) {
        severity = 'Critical'
        outcomeDescription = criticalOutcomeDescription
        if (majorFailures)
            outcomeDescription += " And " + majorOutcomeDescription
    }

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name                : name,
        definition          : definition,
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
    System.err.println "Usage: groovy DefinitionOfDone.groovy <path_to_json_file>"
    System.exit(1)
}

// Read and parse the JSON file
def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Call the evaluation function
def result = evaluate(teamData)
System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
