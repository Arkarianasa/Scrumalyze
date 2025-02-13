#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks Definitions of Done consistency across all Work Items.
 *
 * Rules:
 * 1) Major failure if any Work Item has zero DefinitionsOfDone.
 * 2) Minor failure if DoD sets differ among Work Items.
 * 3) Otherwise, pass with severity = "None".
 *
 * Usage: groovy DefinitionOfDone.groovy <path_to_json_file>
 */

def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "DefinitionOfDone Check"
    // We set severity/passed/outcomeDescription later based on conditions.

    // ----------------------------------------------------------------------------
    // 2. Gather WorkItems
    // ----------------------------------------------------------------------------
    def workItems = teamData.WorkItems ?: []
    if (workItems.isEmpty()) {
        return [
            name               : name,
            severity           : "None",
            passed             : true,
            outcomeDescription : "No work items found; skipping check."
        ]
    }

    // ----------------------------------------------------------------------------
    // 3. Build sets of DoD constraint descriptions for each Work Item
    // ----------------------------------------------------------------------------
    def listOfSets = []
    for (wi in workItems) {
        def definitions = wi.DefinitionsOfDone ?: []
        if (definitions.isEmpty()) {
            // Major fail: missing DoD
            return [
                name               : name,
                severity           : "Major",
                passed             : false,
                outcomeDescription : "One or more work items have no Definitions of Done."
            ]
        }

        // Collect constraint descriptions (trimmed, ignoring null/empty)
        def descSet = definitions.collect { it.DefinitionOfDone?.ConstraintDescription?.trim() }
                                 .findAll { it }
                                 .toSet()
        if (descSet.isEmpty()) {
            // Major fail: all DoDs are null/empty
            return [
                name               : name,
                severity           : "Major",
                passed             : false,
                outcomeDescription : "One or more work items have only empty or null DoD descriptions."
            ]
        }
        listOfSets << descSet
    }

    // ----------------------------------------------------------------------------
    // 4. Check if all sets are identical
    // ----------------------------------------------------------------------------
    def distinctSets = listOfSets.toSet()
    if (distinctSets.size() > 1) {
        return [
            name               : name,
            severity           : "Minor",
            passed             : false,
            outcomeDescription : "Definitions of Done differ among work items."
        ]
    }

    // ----------------------------------------------------------------------------
    // 5. Otherwise, pass
    // ----------------------------------------------------------------------------
    return [
        name               : name,
        severity           : "None",
        passed             : true,
        outcomeDescription : "All work items have the same non-empty Definitions of Done."
    ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
if (args.length < 1) {
    System.err.println "Usage: groovy DefinitionOfDone.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
println JsonOutput.toJson(result)
