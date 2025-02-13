#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that all company policy Definitions of Done are present in every Work Item.
 *
 * Fails (Major) if any Work Item misses at least one company-policy DoD.
 * Passes (None) otherwise.
 *
 * Usage: groovy DefinitionOfDoneCompanyPolicy.groovy <path_to_json_file>
 */

def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "DefinitionOfDone Company Policy Check"

    // ----------------------------------------------------------------------------
    // 2. Collect the team's company-policy DoDs (by constraint description)
    // ----------------------------------------------------------------------------
    def teamDoDs = teamData.team?.DefinitionsOfDone ?: []
    def policyDescriptions = teamDoDs.findAll { it.IsCompanyPolicy }
                                     .collect { it.ConstraintDescription?.trim() }
                                     .findAll { it }
                                     .toSet()
    if (policyDescriptions.isEmpty()) {
        return [
            name               : name,
            severity           : "None",
            passed             : true,
            outcomeDescription : "No company policy DoDs found; skipping check."
        ]
    }

    // ----------------------------------------------------------------------------
    // 3. Verify each WorkItem includes all policy DoDs
    // ----------------------------------------------------------------------------
    def workItems = teamData.WorkItems ?: []
    for (wi in workItems) {
        // Gather policy constraints actually assigned to this WorkItem
        def assignedPolicy = wi.DefinitionsOfDone?.findAll { it.DefinitionOfDone?.IsCompanyPolicy }
                                            ?.collect { it.DefinitionOfDone?.ConstraintDescription?.trim() }
                                            ?.findAll { it }
                                            ?.toSet() ?: []

        // If the assigned policy set doesn't contain all required policy descriptions, fail
        if (!assignedPolicy.containsAll(policyDescriptions)) {
            return [
                name               : name,
                severity           : "Major",
                passed             : false,
                outcomeDescription : "One or more work items are missing a required company policy DoD."
            ]
        }
    }

    // ----------------------------------------------------------------------------
    // 4. Pass if no missing policy
    // ----------------------------------------------------------------------------
    return [
        name               : name,
        severity           : "None",
        passed             : true,
        outcomeDescription : "All company policy Definitions of Done are present in every Work Item."
    ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
if (args.length < 1) {
    System.err.println "Usage: groovy DefinitionOfDoneCompanyPolicy.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath
