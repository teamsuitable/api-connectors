const axios = require('axios')

function printAxiosError(error) {
    const { status, config: { url } } = error.toJSON()
    console.error(`Request error for url ${url} with status ${status}`);
}

/**
 * Pushes events from suitable to engage by reading all the available events from suitable and
 * all the available events from engage. Then pushes any events that are missing from the two.
 *
 * @param suitableUsername
 * @param suitablePassword
 * @param suitablePathwayId
 * @param suitableInstitutionId
 * @param suitableBaseUrl
 * @param engageApiKey
 * @param engageSubmittedByOrganizationId
 * @param engageSubmittedByIdCampusEmail
 */
async function pushEventsFromSuitable({
    suitableUsername,
    suitablePassword,
    suitablePathwayId,
    suitableInstitutionId,
    suitableBaseUrl,
    engageApiKey,
    engageSubmittedByOrganizationId,
    engageSubmittedByIdCampusEmail,
}) {

    const suitableApi = axios.create({
        baseURL: suitableBaseUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // // Read an environment variable (if needed) or simply print "Hello, World!"
    // const message = process.env.MESSAGE || "Hello, World!";
    console.log("Attempting to pull events from suitable using")
    console.log("suitableUsername", suitableUsername)
    console.log("suitablePassword", suitablePassword)
    console.log("suitablePathwayId", suitablePathwayId)
    console.log("suitableInstitutionId", suitableInstitutionId)
    console.log("engageSubmittedByOrganizationId", engageSubmittedByOrganizationId)
    console.log("engageSubmittedByIdCampusEmail", engageSubmittedByIdCampusEmail)

    try {
        const loginResponse = await suitableApi.post('/v1/auth/login',{
            username: suitableUsername,
            password: suitablePassword,
        })

        const accessToken = loginResponse.data.access_token
        const suitableAuthHeader = {
            'Authorization': `Bearer ${accessToken}`
        }
        const baseParams = {
            date: new Date().getTime(),
            direction: 'asc',
            orderBy: 'proximityDate',
            types: 'EVENT',
        }
        let cursor = null
        let suitableEvents = []

        /**
         * Fetch all events from Suitable from now to the future
         * @param nextCursor
         * @return {Promise<void>}
         */
        const fetchEvents = async (nextCursor) => {
            const nextEvents = await suitableApi.get(`/v1/catalogs/${suitablePathwayId}/activities/stream`, {
                headers: suitableAuthHeader,
                params: {
                    ...baseParams,
                    cursor: nextCursor
                }
            })
            cursor = nextEvents.data.meta.nextCursor
            suitableEvents = [ ...suitableEvents, ...nextEvents.data.data ]
            console.log(`Next event cursor ${cursor}`)
            console.log(`Total suitable events ${suitableEvents.length}`)
        }

        await fetchEvents(cursor)
        while ((cursor !== null && cursor !== undefined)) {
            await fetchEvents(cursor)
        }

        // TODO: Read events from Engage
        // TODO: Filter out events from suitable that exist in Engage
        // TODO: Create any missing event in Engage

    } catch (error) {
        if (error instanceof axios.AxiosError) {
            printAxiosError(error)
        } else {
            console.error('Error processing:', error);
        }
    }
}

// Export the function to be used in index.js
module.exports = { pushEventsFromSuitable }
