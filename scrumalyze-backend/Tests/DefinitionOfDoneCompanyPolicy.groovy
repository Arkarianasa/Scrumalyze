#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that all company policy Definitions of Done (DoD) are present in every Work Item.
 *
 * Fails (Major) if any Work Item misses at least one company-policy DoD.
 * Passes (None) otherwise.
 *
 * Usage: groovy DefinitionOfDoneCompanyPolicy.groovy <path_to_json_file>
 *
 * @param teamData A Map containing:
 *   - team: An object with details about the team (including a list of DefinitionsOfDone).
 *   - WorkItems: A list of work items, each potentially having its own DefinitionsOfDone.
 * @return A map representing the evaluation result with the following fields:
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
    def name = "Definition of Done: Company Policy Check"
    def definition = """
        This check ensures that the mandatory (company policy) Definitions of Done 
        are present in every Work Item.
    """.stripIndent().trim()

    // Possible root causes (when the check fails):
    def possibleRootCauses = []
    possibleRootCauses << "Team members might not be aware of the mandatory policy items."
    possibleRootCauses << "Policy DoDs exist but are not linked correctly to each Work Item."
    possibleRootCauses << "Company policy requirements have changed, but not all items are updated."

    // We'll collect which items are missing mandatory policy DoDs here
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Identify the required company policy DoDs
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting evaluation for team '${teamName}'"

    // Gather the constraint descriptions for all team-level, company-policy DoDs
    def teamDoDs = teamData.team?.DefinitionsOfDone ?: []
    def policyDescriptions = teamDoDs.findAll { it.IsCompanyPolicy }
                                     .collect { it.ConstraintDescription?.trim() }
                                     .findAll { it }
                                     .toSet()

    // If there are no company-policy items at all, we can pass with a note
    if (policyDescriptions.isEmpty()) {
        return [
            name               : name,
            definition         : definition,
            severity           : "None",
            passed             : true,
            outcomeDescription : "No company policy DoDs found; skipping check.",
            symptoms           : [],
            possibleRootCauses : possibleRootCauses
        ]
    }

    // ----------------------------------------------------------------------------
    // 3. Evaluate each WorkItem for missing policy DoDs
    // ----------------------------------------------------------------------------
    def workItems = teamData.WorkItems ?: []
    if (workItems.isEmpty()) {
        // If there are required policy DoDs but no work items to check, 
        // we pass by default or treat it as no failures found.
        return [
            name               : name,
            definition         : definition,
            severity           : "None",
            passed             : true,
            outcomeDescription : "No WorkItems provided; skipping check.",
            symptoms           : [],
            possibleRootCauses : possibleRootCauses
        ]
    }

    // Check each WorkItem’s assigned policy constraints
    workItems.each { wi ->
        // Gather the ConstraintDescriptions for any company-policy DoDs this item has
        def assignedPolicy = (wi.DefinitionsOfDone ?: []).findAll { it.DefinitionOfDone?.IsCompanyPolicy }
                                          .collect { it.DefinitionOfDone?.ConstraintDescription?.trim() }
                                          .findAll { it }
                                          .toSet()

        // If the assigned set does NOT contain all policy-required constraints, we fail
        def missing = policyDescriptions - assignedPolicy
        if (!missing.isEmpty()) {
            symptoms << "[WorkItem ${wi.WorkItemID}] is missing the following company-policy DoDs: " +
                       missing.join(", ")
        }
    }

    // ----------------------------------------------------------------------------
    // 4. Determine pass/fail outcome
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : "Major"
    def outcomeDescription = passed 
        ? "All company policy Definitions of Done are present in every Work Item." 
        : "One or more work items are missing required company policy DoDs."

    // ----------------------------------------------------------------------------
    // 5. Return the evaluation result
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
    System.err.println "Usage: groovy DefinitionOfDoneCompanyPolicy.groovy <path_to_json_file>"
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
