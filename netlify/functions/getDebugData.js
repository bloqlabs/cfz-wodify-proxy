// const splitAllowedOrigins = (rawOrigins = "") =>
//   rawOrigins
//     .split(",")
//     .map((origin) => origin.trim())
//     .filter(Boolean);

// const buildCorsHeaders = (origin, allowedOrigins) => ({
//   "Access-Control-Allow-Origin": !origin
//     ? "*"
//     : allowedOrigins.includes(origin)
//     ? origin
//     : "",
//   "Access-Control-Allow-Methods": "GET, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type",
//   "Access-Control-Max-Age": "86400",
// });

// const fetchJsonOrThrow = async (url, apiKey) => {
//   const response = await fetch(url, {
//     headers: {
//       "x-api-key": apiKey,
//     },
//   });

//   if (!response.ok) {
//     const errorBody = await response.text();
//     throw new Error(
//       `Request to ${url} failed with status ${response.status}: ${errorBody}`,
//     );
//   }

//   return response.json();
// };

// exports.handler = async (event) => {
//   const allowedOrigins = splitAllowedOrigins(process.env.ALLOWED_ORIGINS);
//   const origin = event.headers.origin;
//   const corsHeaders = buildCorsHeaders(origin, allowedOrigins);

//   if (event.httpMethod === "OPTIONS") {
//     return {
//       statusCode: 200,
//       headers: corsHeaders,
//       body: "",
//     };
//   }

//   if (event.httpMethod !== "GET") {
//     return {
//       statusCode: 405,
//       headers: corsHeaders,
//       body: JSON.stringify({ error: "Method not allowed" }),
//     };
//   }

//   if (origin && !allowedOrigins.includes(origin)) {
//     return {
//       statusCode: 403,
//       headers: corsHeaders,
//       body: JSON.stringify({ error: "Origin not allowed" }),
//     };
//   }

//   const apiKey = process.env.WODIFY_API_KEY;

//   if (!apiKey) {
//     return {
//       statusCode: 500,
//       headers: corsHeaders,
//       body: JSON.stringify({ error: "Wodify API key is not configured" }),
//     };
//   }

//   const programsUrl = "https://api.wodify.com/v1/programs";
//   const locationsUrl = "https://api.wodify.com/v1/locations";

//   try {
//     const [programs, locations] = await Promise.all([
//       fetchJsonOrThrow(programsUrl, apiKey),
//       fetchJsonOrThrow(locationsUrl, apiKey),
//     ]);

//     return {
//       statusCode: 200,
//       headers: {
//         ...corsHeaders,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ programs, locations }),
//     };
//   } catch (error) {
//     console.error("Failed to fetch Wodify debug data", error);

//     return {
//       statusCode: 500,
//       headers: corsHeaders,
//       body: JSON.stringify({
//         error: "Failed to fetch Wodify debug data",
//         details: error.message,
//       }),
//     };
//   }
// };
