#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

/**
 * Ensures that every process step has a defined Timebox and does not exceed its duration.
 * - If Timebox is missing: Major severity.
 * - If Timebox is exceeded based on StartDateTime/EndDateTime: Minor severity.
 *
 * Usage: groovy ProcessStepTimebox.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Process Step Timebox Check"
    def definition = """
        This check ensures that each process step has a defined timebox and
        the meeting or activity does not exceed its allowed duration.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 4

    def possibleRootCauses = [
        "Timebox not configured for process steps.",
        "Start or end time not recorded correctly.",
        "Meeting facilitation failed to control timing.",
        "Scrum team is not adhering to timeboxing principles."
    ]

    def possibleConsequences = [
        "Loss of meeting discipline and purpose.",
        "Loss of Trust - Stakeholder frustration from prolonged or unstructured sessions.",
        "Reduced team efficiency.",
        "Loss of process consistency – incorrect use of Timeboxes can disrupt the intended Scrum framework.",
        "Difficulty in predictable planning flow."
    ]
    
    def symptoms = []
    def hasMajor = false
    def hasMinor = false

    def processSteps = teamData.team?.ProcessSteps ?: []

    def getDurationInHours = { timebox ->
        try {
            if (!timebox?.StartDateTime || !timebox?.EndDateTime) return null
            def start = LocalDateTime.parse(timebox.StartDateTime, DateTimeFormatter.ISO_DATE_TIME)
            def end = LocalDateTime.parse(timebox.EndDateTime, DateTimeFormatter.ISO_DATE_TIME)
            return ChronoUnit.MINUTES.between(start, end) / 60.0
        } catch (e) {
            return null
        }
    }

    processSteps.each { step ->
        def stepName = step.ProcessStepType?.ProcessStepName ?: "Unnamed Process Step (${step.ProcessStepID})"
        def timebox = step.Timebox

        if (!timebox) {
            hasMajor = true
            symptoms << "Process step '${stepName}' is missing a timebox."
            return
        }

        def expectedDuration = timebox.Duration
        def actualDuration = getDurationInHours(timebox)

        if (actualDuration != null && expectedDuration != null && actualDuration > expectedDuration) {
            hasMinor = true
            symptoms << "Process step '${stepName}' exceeded its timebox: ${actualDuration}h used vs ${expectedDuration}h allowed."
        }
    }

    def severity = "None"
    def outcomeDescription = "All process steps have valid timeboxes and stay within duration limits."

    if (hasMajor) {
        severity = "Major"
        outcomeDescription = "One or more process steps are missing a timebox."
    } else if (hasMinor) {
        severity = "Minor"
        outcomeDescription = "All process steps have a timebox, but some exceed the allocated duration."
    }

    def passed = (severity == "None")

    return [
        name                 : name,
        definition           : definition,
        categoryID           : categoryID,
        severity             : severity,
        passed               : passed,
        outcomeDescription   : outcomeDescription,
        symptoms             : symptoms,
        possibleRootCauses   : possibleRootCauses,
        possibleConsequences : possibleConsequences
    ]
}

// -----------------------------------------------------------------------------
// Main script logic
// -----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy ProcessStepTimebox.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)
