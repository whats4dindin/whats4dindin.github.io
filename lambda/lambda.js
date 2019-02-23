
function buildResponse(statusCode, payload) {
    return {
        statusCode: statusCode,
        body: JSON.stringify(payload)
    };
}

async (event) => {
    if (!event.queryParameters.day) {
        return buildResponse(400, { error: "must have GET parameter \"day\"" });
    }
}

