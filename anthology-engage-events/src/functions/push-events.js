const axios = require('axios')

function printAxiosError(error) {
    const { status, config: { url } } = error.toJSON()
    console.error(`Request error for url ${url} with status ${status}`);
}

/**
 * Pushes events from suitable to engage by reading all the available events from suitable from a certain point in time
 * and then pushes these events to an Organization's event calendar in Engage.
 *
 * @param suitableUsername
 * @param suitablePassword
 * @param suitablePathwayId
 * @param suitableInstitutionId
 * @param suitableBaseUrl
 * @param suitableDateCreatedDaysAgoOrLess
 * @param engageApiKey
 * @param engageApiBaseUrl
 * @param engageSubmittedByOrganizationId
 * @param engageSubmittedByIdCampusEmail
 */
async function pushEventsFromSuitable({
    suitableUsername,
    suitablePassword,
    suitablePathwayId,
    suitableInstitutionId,
    suitableBaseUrl,
    suitableDateCreatedDaysAgoOrLess,
    engageApiKey,
    engageApiBaseUrl,
    engageSubmittedByOrganizationId,
    engageSubmittedByIdCampusEmail,
}) {

    const suitableApi = axios.create({
        baseURL: suitableBaseUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const engageApi = axios.create({
        baseURL: engageApiBaseUrl,
        headers: {
            'Accept': 'application/json',
            'X-Engage-Api-Key': engageApiKey,
        }
    });

    console.log("Attempting to pull events from suitable using")
    console.log("suitableUsername", suitableUsername)
    console.log("suitablePassword", suitablePassword)
    console.log("suitablePathwayId", suitablePathwayId)
    console.log("suitableInstitutionId", suitableInstitutionId)
    console.log("engageSubmittedByOrganizationId", engageSubmittedByOrganizationId)
    console.log("engageSubmittedByIdCampusEmail", engageSubmittedByIdCampusEmail)

    try {
        // Login API from https://developer.suitable.co/#00809ff1-90fd-40a0-8cae-4575fe24d9eb
        const loginResponse = await suitableApi.post('/v1/auth/login',{
            username: suitableUsername,
            password: suitablePassword,
        })

        const accessToken = loginResponse.data.access_token
        const suitableAuthHeader = {
            'Authorization': `Bearer ${accessToken}`
        }

        // List Events API from https://developer.suitable.co/#308592d2-5f76-4cf7-a30f-ed16fc5363d9
        const now = new Date().getTime()
        let dateRestriction = {
            date: now,
            orderBy: 'proximityDate',
        }
        if (suitableDateCreatedDaysAgoOrLess) {
            dateRestriction = {
                date: now - (suitableDateCreatedDaysAgoOrLess * 24 * 60 * 60 * 1000),
                orderBy: 'dateCreated',
            }
        }
        console.log("Using date restriction", dateRestriction)
        const baseParams = {
            ...dateRestriction,
            direction: 'asc',
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

        // Ideally we could read events from Engage + filter out events from suitable that exist in Engage but Engage
        // offers no way to include a reference ID on an event there isn't a great way to confidently look for
        // events we already created and exclude those. Instead, we aim to only create events that were included from
        // the date created API predicate.
        for (let suitableEvent of suitableEvents) {
            // console.log("Pushing event", suitableEvent)

            // Used Engage's Create Event API https://engage-api.campuslabs.com/swagger/index.html#/Events/post_v3_0_events_event
            await engageApi.post("/v3.0/events/event", {
                submittedByOrganizationId: engageSubmittedByOrganizationId,
                submittedById: {
                    campusEmail: engageSubmittedByIdCampusEmail,
                },
                name: suitableEvent.title,
                description: suitableEvent.description,
                startsOn: new Date(suitableEvent.startDate).toISOString(),
                endsOn: new Date(suitableEvent.endDate).toISOString(),
                address: {
                    onlineLocation: `${suitableBaseUrl}/institution/${suitableInstitutionId}/activities/${suitableEvent.id}`,
                    instructions: "To obtain credit for this event, log into Suitable",
                },
                benefits: [ "Credit" ],
                state: {
                    status: "Approved",
                },
                visibility: "Organization",
            })
        }

        return suitableEvents
    } catch (error) {
        if (error instanceof axios.AxiosError) {
            printAxiosError(error)
        } else {
            console.error('Error processing:', error);
        }
        return null
    }
}

// Export the function to be used in index.js
module.exports = { pushEventsFromSuitable }
