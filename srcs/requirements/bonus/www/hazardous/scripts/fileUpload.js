(function() {
  'use strict';

  // Constants
  const MAX_SIZE_MB = 100;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  // DOM Elements
  const uploadForm = document.getElementById('uploadForm');
  const statusEl = document.getElementById('uploadStatus');
  const passwordInput = document.getElementById('password');
  const fileInput = document.getElementById('fileInput');

  if (!uploadForm || !statusEl || !passwordInput || !fileInput) {
    console.error('Missing required DOM elements');
    return;
  }

  // Helper function to sanitize filename
  function sanitizeFilename(filename) {
    return filename
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9.-]/gi, '_');
  }

  // Main upload function
  async function handleUpload(e) {
    e.preventDefault();
    statusEl.textContent = 'Uploading...';
    statusEl.style.color = 'black';

    try {
      const file = fileInput.files[0];
      const password = passwordInput.value;

      // Validate file size
      if (file.size > MAX_SIZE_BYTES) {
        throw new Error(`File too large! Max size is ${MAX_SIZE_MB}MB`);
      }

      console.log('Starting upload...', {
        passwordLength: password.length,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      // Prepare form data
      const formData = new FormData();
      formData.append('password', password);
      formData.append('myFile', new File([file], sanitizeFilename(file.name), { type: file.type }));

      // Send request
      const response = await fetch('/upload', {
        method: 'POST',
        headers: { 'X-Upload-Password': password },
        body: formData
      });

      // Handle response
      const result = await parseResponse(response);
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Success
      statusEl.style.color = 'green';
      statusEl.textContent = `Upload successful: ${result.filename}`;
      
      // Refresh file list if available
      if (typeof window.loadFiles === 'function') {
        window.loadFiles();
      }
      
    } catch (err) {
      statusEl.style.color = 'red';
      statusEl.textContent = err.message;
      console.error('Upload error:', err);
    }
  }

  // Helper to parse different response types
  async function parseResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    const text = await response.text();
    if (text.includes('Invalid upload password')) {
      return { error: 'Invalid upload password' };
    }
    if (text.includes('Invalid file type')) {
      return { error: 'Invalid file type' };
    }
    return { error: `Server error (${response.status})` };
  }

  // Initialize
  uploadForm.addEventListener('submit', handleUpload);
  
  // For manual access if needed
  window.handleFileUpload = handleUpload;
})();
