const { pushEventsFromSuitable } = require('./functions/push-events')

const suitableUsername = process.env["SUITABLE_USERNAME"]
const suitablePassword = process.env["SUITABLE_PASSWORD"]
const suitablePathwayId = process.env["SUITABLE_PATHWAY_ID"]
const suitableInstitutionId = process.env["SUITABLE_INSTITUTION_ID"]
const suitableBaseUrl = process.env["SUITABLE_BASE_URL"] || "https://app.suitable.co"
const engageApiKey = process.env["ENGAGE_API_KEY"]
const engageSubmittedByOrganizationId = process.env["ENGAGE_SUBMITTED_BY_ORGANIZATION_ID"]
const engageSubmittedByIdCampusEmail = process.env["ENGAGE_SUBMITTED_BY_ID_CAMPUS_EMAIL"]

pushEventsFromSuitable({
    suitableUsername,
    suitablePassword,
    suitablePathwayId,
    suitableInstitutionId,
    suitableBaseUrl,
    engageApiKey,
    engageSubmittedByOrganizationId,
    engageSubmittedByIdCampusEmail,
})
