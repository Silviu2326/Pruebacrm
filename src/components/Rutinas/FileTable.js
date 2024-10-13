import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import './FileTable.css';

const FileTable = ({ theme }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('/api/files');
        setFiles(response.data);
        console.log('Fetched files:', response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleFileChange = (event) => {
    console.log('Selected file:', event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    console.log('Uploading file:', selectedFile);

    try {
      await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh file list after successful upload
      const response = await axios.get('/api/files');
      setFiles(response.data);
      setSelectedFile(null); // Clear the selected file
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileDownload = async (fileId, filename) => {
    console.log('Downloading file with ID:', fileId);
    try {
      const response = await axios.get(`/api/files/${fileId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      console.log('File downloaded successfully:', filename);
    } catch (error) {
      console.error('Error downloading file:', error.response?.data?.message || error.message);
    }
  };

  const handleFileDelete = async (fileId) => {
    console.log('Deleting file with ID:', fileId);
    try {
      await axios.delete(`/api/files/${fileId}`);
      setFiles(files.filter(file => file._id !== fileId));
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className={`filetable-container ${theme} mx-auto p-4`}>
      <h2 className="text-2xl font-bold mb-4">Uploaded Files</h2>
      <div className="filetable-upload-section mb-4">
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
        />
        <label htmlFor="file-input" className={`filetable-upload-label ${theme}`}
        style={{
          background: 'var(--search-button-bg)',
          border: '1px solid var(--button-border)',
          padding: '5px',
          height: '44px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background 0.3s',
          textAlign: 'left',
        }}>
          Seleccionar archivo
        </label>
        <button
          className={`filetable-upload-button ${theme}`}
          onClick={handleFileUpload}
          disabled={!selectedFile}
          style={{
            background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
            color:  'var(--button-text-dark)' ,
            border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s ease',
          }}
        >
          Upload File
        </button>
      </div>
      <div className="overflow-x-auto">
      <table className={`filetable ${theme}`}>
  <thead>
    <tr>
      <th className={theme}>Filename</th>
      <th className={`filetable-size ${theme}`}>File Size</th>
      <th className={`filetable-actions ${theme}`}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {files.map((file) => (
      <tr key={file._id}>
        <td className={theme}>{file.filename}</td>
        <td className={`filetable-size ${theme}`}>{(file.length / 1024).toFixed(2)} KB</td>
        <td className={`filetable-actions ${theme}`}>
          <DropdownButton 
            id={`dropdown-${file._id}`} 
            title="..." 
            className={`filetable-dropdown-button ${theme}`}
          >
            <Dropdown.Item onClick={() => handleFileDownload(file._id, file.filename)}
              style={{
                background:'var(--create-button-bg)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>Descargar</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFileDelete(file._id)}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>Eliminar</Dropdown.Item>
          </DropdownButton>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>
    </div>
  );
};

export default FileTable;
