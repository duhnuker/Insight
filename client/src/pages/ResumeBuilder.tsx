import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

const ResumeBuilder = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setError('');
    }
  };

  const submitResume = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const uploadResponse = await axios.post('http://localhost:5000/resumeBuilder/upload', formData, {
        headers: {
          jwt_token: localStorage.token,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const { id } = uploadResponse.data;

      setFileUrl(`http://localhost:5000/resumeBuilder/file/${id}`);

      const analysisResponse = await axios.get(`http://localhost:5000/resumeBuilder/analysis/${id}`, {
        headers: { jwt_token: localStorage.token }
      });
      setAnalysis(analysisResponse.data.feedback);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-600 flex-col justify-center pb-4'>
      <div className='p-8 rounded-lg shadow-lg text-center mb-4'>
        <h1 className='text-3xl font-bold text-white mb-8'>Insight</h1>
        <h2 className="text-xl mb-4 text-white">Resume Analysis</h2>
        <div className='text-center py-6 text-white font-medium italic'>
          Let AI enhance your resume for better job matches
        </div>
      </div>

      <div className='flex justify-center pb-4'>
        <NavBar />
      </div>

      <div className='px-4 md:px-8 max-w-2xl mx-auto space-y-4'>
        <div className='bg-gray-500 p-8 rounded-lg shadow-lg'>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="mb-4 text-white"
          />

          <button
            onClick={submitResume}
            disabled={!file || loading}
            className='w-full bg-lime-600 text-white py-3 rounded-md hover:bg-lime-600 transition duration-200 font-medium'
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>

          {error && (
            <div className="mt-4 text-red-300 font-medium">
              {error}
            </div>
          )}

          {analysis && (
            <div className="mt-4">
              <h2 className="text-xl font-bold text-white mb-2">Analysis Results:</h2>
              <div className="text-white text-2xl">
                {typeof analysis === 'string' ? (
                  analysis
                ) : (
                  analysis[0] && `${analysis[0].label}: ${Math.round(analysis[0].score * 100)}% confidence`
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
