const { pushEventsFromSuitable } = require('./functions/push-events')

const suitableUsername = process.env["SUITABLE_USERNAME"]
const suitablePassword = process.env["SUITABLE_PASSWORD"]
const suitablePathwayId = process.env["SUITABLE_PATHWAY_ID"]
const suitableInstitutionId = process.env["SUITABLE_INSTITUTION_ID"]
const suitableBaseUrl = process.env["SUITABLE_BASE_URL"] || "https://app.suitable.co"
const suitableDateCreatedDaysAgoOrLess = process.env["SUITABLE_DATE_CREATED_DAYS_AGO_OR_LESS"]
const engageApiKey = process.env["ENGAGE_API_KEY"]
const engageApiBaseUrl = "https://engage-api.campuslabs.com/api"
const engageSubmittedByOrganizationId = process.env["ENGAGE_SUBMITTED_BY_ORGANIZATION_ID"]
const engageSubmittedByIdCampusEmail = process.env["ENGAGE_SUBMITTED_BY_ID_CAMPUS_EMAIL"]

pushEventsFromSuitable({
    suitableUsername,
    suitablePassword,
    suitablePathwayId,
    suitableInstitutionId,
    suitableBaseUrl,
    suitableDateCreatedDaysAgoOrLess: suitableDateCreatedDaysAgoOrLess ? parseInt(suitableDateCreatedDaysAgoOrLess) : null,
    engageApiKey,
    engageApiBaseUrl,
    engageSubmittedByOrganizationId: parseInt(engageSubmittedByOrganizationId),
    engageSubmittedByIdCampusEmail,
}).then((events) => {
    if (events) {
        console.log(`Finished pushing ${events.length} events to engage`)
    }
})
