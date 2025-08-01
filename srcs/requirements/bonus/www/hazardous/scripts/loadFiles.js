console.log('loadFiles.js executing');
(function() {
  'use strict';

  // Private helper functions
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
      jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️',
      pdf: '📄',
      zip: '📦', rar: '📦', '7z': '📦',
      txt: '📝', 
      default: '📁'
    };
    return icons[ext] || icons.default;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 bytes';
    const k = 1024;
    const sizes = ['bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Main function exposed to window
  window.loadFiles = async function() {
    const fileListElement = document.getElementById('fileList');
    if (!fileListElement) {
      console.error('File list element not found');
      return;
    }

    try {
      fileListElement.innerHTML = '<p>Loading files...</p>';
      
      const response = await fetch('/files');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.debug('Files data:', data);
      
      if (!data.files) throw new Error('Invalid response format');
      
      fileListElement.innerHTML = data.files.length ? `
        <ul class="file-list">
          ${data.files.map(file => `
            <li>
              ${getFileIcon(file.name)} 
              <span class="file-name">${file.name}</span>
              <span class="file-size">${formatFileSize(file.size)}</span>
              <a href="${file.url}" class="download-btn" download>Download</a>
            </li>
          `).join('')}
        </ul>
      ` : '<p>No files available</p>';
    } catch (err) {
      console.error('File load error:', err);
      fileListElement.innerHTML = `<p class="error">Error: ${err.message}</p>`;
    }
  };

  // initialization
  document.addEventListener('DOMContentLoaded', window.loadFiles);
})();
