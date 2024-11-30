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
        },
        validateStatus: status => status < 500
      });
  
      if (uploadResponse.status !== 200) {
        throw new Error(uploadResponse.data.error || 'Upload failed');
      }
      
      const { id } = uploadResponse.data;
      setFileUrl(`http://localhost:5000/resumeBuilder/file/${id}`);
  
      const analysisResponse = await axios.get(`http://localhost:5000/resumeBuilder/analysis/${id}`, {
        headers: { jwt_token: localStorage.token }
      });
      setAnalysis(analysisResponse.data.analysis);
    } catch (error: unknown) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error && error.message
        ? error.message
        : 'File upload failed. Please ensure you are using a .doc or .docx file.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className='min-h-screen bg-gradient-to-tr from-slate-900 via-emerald-900 to-green-700 flex-col justify-center pb-4'>
      <div className='p-8 rounded-lg shadow-lg text-center mb-4'>
        <h1 className='text-6xl font-bold text-white'>Insight</h1>
        <h2 className="text-xl mt-4 text-emerald-100">Resume Analysis</h2>
        <div className='text-center pt-8 text-emerald-100 font-medium italic'>
          Let AI enhance your resume for better job matches
        </div>
      </div>

      <div className='flex justify-center pb-4'>
        <NavBar isAuthenticated={true}/>
      </div>

      <div className='px-4 md:px-8 max-w-2xl mx-auto space-y-4'>
        <div className='bg-slate-800/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-emerald-800/30 hover:border-emerald-700/50 transition-all duration-300 mt-20'>
          <input
            type="file"
            accept=".doc,.docx"
            onChange={handleFileUpload}
            className="mb-4 text-emerald-100 w-full"
          />

          <button
            onClick={submitResume}
            disabled={!file || loading}
            className='w-full bg-emerald-700 text-white py-3 rounded-md hover:bg-emerald-600 hover:shadow-lg transition duration-300 font-medium cursor-pointer'
          >
            {loading ? 'Analysing...' : 'Analyse Resume'}
          </button>

          {error && (
            <div className="mt-4 text-red-300 font-medium">
              {error}
            </div>
          )}

          {analysis && (
            <div className="mt-4">
              <h2 className="text-xl font-bold text-white mb-2">Analysis Results:</h2>
              <div className="text-emerald-200">
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
