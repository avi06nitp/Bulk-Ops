

function createTicket(email, ticketData, authHeader) {
  console.log('Creating ticket for email:', email);
  console.log('Ticket data:', ticketData);

  const data = {
    email: email,
    subject: ticketData.subject,
    description: ticketData.description,
    status: Number(ticketData.status),
    priority: Number(ticketData.priority),
    group_id: Number(ticketData.group_id),
    type: ticketData.type,
    custom_fields: {
      cf_issue_type: ticketData.cf_issue_type,
      cf_subissue: ticketData.cf_subissue
    }
  };

  console.log('Request data:', data);

  const options = {
    url: 'https://domain.freshdesk.com/api/v2/tickets',
    method: 'POST',
    json: true,
    body: data,
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    }
  };

  console.log('Request options:', options);

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      console.log('Request completed. Response:', response);
      console.log('Body:', body);
      if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        console.log('Ticket created successfully:', body);
        resolve(body);
      } else {
        console.log('Error creating ticket:', error || body);
        reject(body || error);
      }
    });
  });
}

exports = {
  

  serverMethod: async function(args) {
    console.log('Server method called with args:', args);

    const { emails, ticketData } = args;
    console.log('Emails:', emails);
    console.log('Ticket data:', ticketData);

    const apiKey = 'YOUR_AUTH_KEY';
    const authHeader = `Basic ${Buffer.from(apiKey + ':X').toString('base64')}`;
    console.log('Auth header:', authHeader);

    try {
      const responses = await Promise.all(emails.map(email => createTicket(email, ticketData, authHeader)));
      console.log('All tickets created successfully:', responses);
      return { success: true, responses: responses };
    } catch (error) {
      const errorMsg = error.response ? error.response.data : error.message;
      console.log('Error in server method:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }
};
