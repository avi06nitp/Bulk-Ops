let client; 

init();

async function init() {
  try {
    client = await app.initialized(); 
    client.events.on('app.activated', takePayload);
  } catch (err) {
    console.error('Error initializing app:', err);
  }
}

async function takePayload() {
  document.getElementById('ticketForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const subject = document.getElementById('subject').value;
    const description = document.getElementById('description').value;
    const status = document.getElementById('status').value;
    const priority = document.getElementById('priority').value;
    const group_id = document.getElementById('group_id').value;
    const type = document.getElementById('type').value;
    const cf_issue_type = document.getElementById('cf_issue_type').value;
    const cf_subissue = document.getElementById('cf_subissue').value;
    const csvFile = document.getElementById('csvFile').files[0];

    if (!csvFile) {
      const errorElement = document.getElementById('error');
      errorElement.textContent = 'Please select a CSV file.';
      return;
    } else {
      const errorElement = document.getElementById('error');
      errorElement.textContent = '';
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
      const csvData = event.target.result;
      const emails = parseCsv(csvData);
      const ticketData = {
        subject,
        description,
        status,
        priority,
        group_id,
        type,
        cf_issue_type,
        cf_subissue
      };
      await createTickets(emails, ticketData); 
    };
    reader.readAsText(csvFile);
  });
}

function parseCsv(data) {
  const rows = data.split('\n').slice(1); 
  const emails = rows.map(row => row.trim()).filter(row => row);
  return emails;
}

async function createTickets(emails, ticketData) {
  try {
    const options = {
      emails: emails,
      ticketData: ticketData
    };
    const data = await client.request.invoke('serverMethod', options);
    console.log("Server method Request ID is: " + data.requestID);
    console.log("Server method response is: ", data.response);

    const logElement = document.getElementById('log');
    logElement.textContent = '';

    for (const email of emails) {
      logElement.textContent += `Successfully created ticket for ${email}\n`;
    }
  } catch (err) {
    console.error("Request ID:", err.requestID);
    console.error("Error status:", err.status);
    console.error("Error message:", err.message);

    const logElement = document.getElementById('log');
    logElement.textContent = ''; 

    for (const email of emails) {
      logElement.textContent += `Failed to create ticket for ${email}: ${err.message}\n`;
    }
  }
}
