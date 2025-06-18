import fetch from 'node-fetch';

fetch('https://sxsconsultoria.app.n8n.cloud/webhook/e35b16d3-bb8d-44a5-9294-2982cfb286c7', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(res => res.text())
  .then(data => console.log(data))
  .catch(err => console.error(err));