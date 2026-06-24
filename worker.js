export default {
  async fetch(request) {
    return new Response('Hello from Worker v3.2!', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
