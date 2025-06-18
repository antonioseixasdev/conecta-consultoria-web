# Simple Chat Frontend for n8n Webhook

## 1. Objective
These files (`index.html`, `style.css`, `script.js`) create a basic web-based chat interface that sends user messages to an n8n webhook and displays the webhook's responses.

## 2. Files Created
*   `index.html`: The main HTML structure of the chat interface.
*   `style.css`: CSS styles for the chat interface.
*   `script.js`: JavaScript code to handle sending messages, receiving responses, and updating the chat UI.

## 3. How it Works
1.  The user types a message into the input field and clicks the "Enviar" button or presses the Enter key.
2.  The JavaScript in `script.js` captures this message.
3.  The user's message is immediately displayed in the chat window with a "sent" style.
4.  An asynchronous HTTP POST request is made to the n8n Webhook URL specified in `script.js`.
    *   The request body is a JSON object: `{"message": "the user's actual message"}`.
5.  The frontend then waits for a JSON response from the n8n webhook.
6.  **n8n Webhook Configuration Expectation**:
    *   Your n8n workflow should be triggered by this webhook.
    *   It should be designed to receive the `{"message": "..."}` JSON payload.
    *   It should be configured to send back a JSON response.
    *   Ideally, this response should be structured as `{"reply": "This is n8n's answer"}`. The `script.js` is specifically looking for the `reply` key to extract the message content.
7.  If a `reply` key is found in the response, its value is displayed in the chat window as a "received" message.
8.  If a `reply` key is *not* found, the entire JSON response from n8n is stringified and displayed as a "received" message. This helps in debugging the response structure.

## 4. Setup Instructions

### n8n Webhook Node Configuration
1.  In your n8n workflow, add a **Webhook node**.
2.  When you select the Webhook node, it will show "Test URL" and "Production URL" in its properties panel. Copy the appropriate URL for your use case.
    *   **Test URL**: Use this for development and testing. It only works when you manually execute the workflow in the n8n editor.
    *   **Production URL**: Use this when your workflow is active and you want it to run automatically when the webhook is called.
3.  Configure the Webhook node settings:
    *   **HTTP Method**: Set to `POST`.
    *   **Response Mode**:
        *   `Last Node`: The output of the last executed node in your workflow will be sent as the HTTP response. This is often the simplest.
        *   `Using 'Respond to Webhook' node`: Allows you to define a custom response at a specific point in your workflow using a "Respond to Webhook" node.
    *   **JSON Passthrough**: It's recommended to **enable** this. It makes the incoming JSON data (`{"message": "..."}`) easily accessible in subsequent n8n nodes (e.g., you can use `{{ $json.message }}` in an expression).
    *   **Path**: (Optional) You can define a custom path for your webhook URL if desired.
4.  Ensure your n8n workflow processes the incoming message (e.g., using an AI node, a database node, or a simple "Set" node to craft a reply) and then sends a JSON response.
    *   If using "Response Mode: Last Node", the last node's output should be the JSON you want to send back (e.g., `{"reply": "Processed message"}`).
    *   If using a "Respond to Webhook" node, configure its "Response Body (JSON)" field with the desired JSON output.

### Frontend Configuration (`script.js`)
1.  Open the `script.js` file in a text editor.
2.  Locate the following line:
    ```javascript
    const N8N_WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL_HERE';
    ```
3.  Replace `'YOUR_N8N_WEBHOOK_URL_HERE'` with the actual Test or Production URL you copied from your n8n Webhook node.
    ```javascript
    // Example:
    // const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/your-path';
    // or for testing:
    // const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook-test/your-path';
    ```

### Running the Chat
1.  Ensure all three files (`index.html`, `style.css`, and `script.js`) are located in the same directory on your computer or web server.
2.  Open the `index.html` file in a modern web browser (e.g., Chrome, Firefox, Edge).
3.  You should now be able to send messages and, if your n8n webhook is correctly configured and active, receive responses.

## 5. Customizing the n8n Response Handling
The `script.js` file is set up to look for a specific key in the JSON response from your n8n webhook.

By default, it expects: `{"reply": "This is the message from n8n."}`

If your n8n workflow sends back a JSON response with a different structure (e.g., `{"answer": "Some text"}` or `{"data": {"response_text": "Hello"}}`), you will need to adjust the following part of the `sendMessageToN8n` function in `script.js`:

```javascript
// Current code:
if (responseData && responseData.reply) {
    appendMessage(responseData.reply, 'received');
} else {
    // Fallback if the response structure is different or no specific reply field
    appendMessage(JSON.stringify(responseData), 'received');
    console.warn('Received unexpected response structure from n8n:', responseData);
}
```

**Example Modification:**
If your n8n workflow returns `{"bot_response": "Hello there!"}`, you would change it to:

```javascript
// Modified code:
if (responseData && responseData.bot_response) {
    appendMessage(responseData.bot_response, 'received');
} else {
    // Fallback
    appendMessage(JSON.stringify(responseData), 'received');
    console.warn('Received unexpected response structure from n8n:', responseData);
}
```

## 6. Important Considerations

*   **CORS (Cross-Origin Resource Sharing)**:
    *   If your n8n instance is hosted on a different domain than where you are running the `index.html` file (e.g., n8n on `https://my-n8n.com` and chat opened from `file:///` or `http://localhost`), the browser's security policies (CORS) will likely block the `fetch` request.
    *   **Solution**: Configure CORS in your n8n instance. This usually involves setting environment variables for your n8n setup. Common variables include:
        *   `N8N_CORS_ALLOWED_ORIGINS`: Set this to `*` to allow all origins (less secure, good for testing) or to the specific domain where your chat frontend is hosted (e.g., `http://localhost:8080`).
        *   `N8N_CORS_ALLOWED_METHODS`: Should include `POST`.
        *   `N8N_CORS_ALLOWED_HEADERS`: Might need to include `Content-Type`.
    *   Alternatively, the "Respond to Webhook" node in n8n might offer options to set custom HTTP headers for the response, where you can include CORS headers like `Access-Control-Allow-Origin: *`.
    *   Without proper CORS headers from n8n, you will see errors in the browser's developer console related to "Cross-Origin Request Blocked."

*   **Error Handling**:
    *   The provided `script.js` has basic error handling for network issues or if the webhook URL is unreachable. It displays an error message in the chat window.
    *   For a production application, you might want to implement more sophisticated error logging, user notifications, or retry mechanisms.

*   **Security**:
    *   **Webhook URLs**: Production webhook URLs are public endpoints. If the information processed is sensitive, consider implementing authentication or authorization mechanisms in your n8n workflow. This could involve passing a secret token in the headers or body, which your n8n workflow then validates.
    *   **Input Sanitization**: While this example directly displays user input and n8n responses, be cautious about potential Cross-Site Scripting (XSS) if the content could include HTML or script tags and is not properly sanitized (though `textContent` used in `appendMessage` provides some protection against this for the displayed messages).

*   **HTTPS**:
    *   If your n8n instance is running on HTTPS (which it should for production), ensure you are accessing the chat frontend also via HTTPS if it's hosted, or be aware that browsers might block mixed content if the frontend is on HTTP and tries to call an HTTPS webhook. Using `file:///` for local testing is generally fine.
