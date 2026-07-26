const express = require('express');
const catalyst = require('zcatalyst-sdk-node');

const app = express();
app.use(express.json());

// Advanced I/O functions route incoming requests
app.all('/', async (req, res) => {
    try {
        const catalystApp = catalyst.initialize(req);
        const userManagement = catalystApp.userManagement();
        
        // This accepts the exact JSON payload format you provided
        // We will default to the provided payload or extract it from req.body
        const payload = req.body && Object.keys(req.body).length > 0 
            ? req.body 
            : {
                request_type: "add_user",
                request_details: {
                    user_details: {
                        email_id: "r.simmons@zylker.com",
                        first_name: "Rowena",
                        last_name: "Simmons",
                        org_id: "1026298298",
                        role_details: {
                            role_name: "App Administrator",
                            role_id: "2000000004073"
                        }
                    },
                    auth_type: "web"
                }
            };
            
        if (payload.request_type === 'add_user' && payload.request_details) {
            const userDetails = payload.request_details.user_details;
            const authType = payload.request_details.auth_type || 'web';

            // Generate the custom token dynamically based on the payload
            const customToken = await userManagement.generateCustomToken({
                type: authType,
                user_details: {
                    email_id: userDetails.email_id,
                    first_name: userDetails.first_name,
                    last_name: userDetails.last_name,
                    org_id: userDetails.org_id,
                    role_name: userDetails.role_details ? userDetails.role_details.role_name : undefined
                }
            });

            // Return the custom token in JSON format as required by the frontend
            return res.status(200).json(customToken);
        } else {
            return res.status(400).json({ error: "Invalid payload. Expected 'add_user' request_details." });
        }
    } catch (error) {
        console.error("Catalyst token generation error:", error);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = app;
