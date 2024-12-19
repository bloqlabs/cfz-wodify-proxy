exports.handler = async (event, context) => {
	// Get allowed origins from environment variable
	const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map((origin) =>
		origin.trim()
	);
	const origin = event.headers.origin;

	// Set common CORS headers
	const corsHeaders = {
		'Access-Control-Allow-Origin': allowedOrigins.includes(origin)
			? origin
			: '',
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '86400',
	};

	// Handle preflight requests
	if (event.httpMethod === 'OPTIONS') {
		return {
			statusCode: 200,
			headers: corsHeaders,
			body: '',
		};
	}

	// Check HTTP method
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			headers: corsHeaders,
			body: JSON.stringify({ error: 'Method not allowed' }),
		};
	}

	// Check origin
	if (!allowedOrigins.includes(origin)) {
		return {
			statusCode: 403,
			headers: corsHeaders,
			body: JSON.stringify({ error: 'Origin not allowed' }),
		};
	}

	try {
		// Parse the POST body
		const { date } = JSON.parse(event.body);

		// Validate required parameters
		if (!date) {
			return {
				statusCode: 400,
				headers: corsHeaders,
				body: JSON.stringify({ error: 'Missing date parameter' }),
			};
		}

		const API_KEY = process.env.WODIFY_API_KEY;
		const location = process.env.WODIFY_LOCATION_ID;
		const program = process.env.WODIFY_PROGRAM_ID;

		const fetchUrl = `https://api.wodify.com/v1/workouts/formattedworkout?date=${date}&location=${encodeURIComponent(
			location
		)}&program=${encodeURIComponent(program)}`;

		console.log('Fetching from URL:', fetchUrl); // Debug log

		const response = await fetch(fetchUrl, {
			headers: {
				'x-api-key': API_KEY,
			},
		});

		const data = await response.json();

		// Debug log
		console.log('Wodify API Response:', data);

		return {
			statusCode: 200,
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		};
	} catch (error) {
		console.error('Error:', error);
		return {
			statusCode: 500,
			headers: corsHeaders,
			body: JSON.stringify({
				error: 'Failed to fetch workout data',
				details: error.message,
			}),
		};
	}
};
