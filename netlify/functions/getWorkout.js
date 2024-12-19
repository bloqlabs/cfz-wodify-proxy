const fetch = require('node-fetch');

exports.handler = async (event, context) => {
	// Get allowed origins from environment variable
	const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
	const origin = event.headers.origin;

	// Check HTTP method
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			headers: {
				'Access-Control-Allow-Origin': allowedOrigins.includes(origin)
					? origin
					: '',
			},
			body: JSON.stringify({ error: 'Method not allowed' }),
		};
	}

	// Check origin
	if (!allowedOrigins.includes(origin)) {
		return {
			statusCode: 403,
			body: JSON.stringify({ error: 'Origin not allowed' }),
		};
	}

	try {
		// Parse the POST body
		const { date, location, program } = JSON.parse(event.body);

		// Validate required parameters
		if (!date || !location || !program) {
			return {
				statusCode: 400,
				headers: {
					'Access-Control-Allow-Origin': origin,
				},
				body: JSON.stringify({ error: 'Missing required parameters' }),
			};
		}

		const API_KEY = process.env.WODIFY_API_KEY;
		const fetchUrl = `https://api.wodify.com/v1/workouts/formattedworkout?date=${date}&location=${encodeURIComponent(
			location
		)}&program=${encodeURIComponent(program)}`;

		const response = await fetch(fetchUrl, {
			headers: {
				'x-api-key': API_KEY,
			},
		});

		const data = await response.json();

		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': origin,
				'Access-Control-Allow-Methods': 'POST',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
			body: JSON.stringify(data),
		};
	} catch (error) {
		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': origin,
			},
			body: JSON.stringify({
				error: 'Failed to fetch workout data',
				details: error.message,
			}),
		};
	}
};

// Handle OPTIONS requests for CORS
exports.handler.options = async (event) => {
	const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
	const origin = event.headers.origin;

	if (!allowedOrigins.includes(origin)) {
		return {
			statusCode: 403,
			body: '',
		};
	}

	return {
		statusCode: 204,
		headers: {
			'Access-Control-Allow-Origin': origin,
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Max-Age': '86400',
		},
		body: '',
	};
};
