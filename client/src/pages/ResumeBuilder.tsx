import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

const ResumeBuilder = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setError('');
    }
  };

  const uploadResume = async () => {
    if (!file) return;

    setIsUploading(true);
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
      setUploadedFileId(id);
    } catch (error: unknown) {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };


  const viewResume = async (fileId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/resumeBuilder/file/${fileId}`, {
        headers: {
          jwt_token: localStorage.token
        },
        responseType: 'blob'
      });

      if (response.data.size === 0) {
        throw new Error("Empty file received");
      }

      const fileUrl = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setFileUrl(fileUrl);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(`Failed to retrieve file: ${error.response?.data?.error || error.message}`);
      } else {
        setError('Failed to retrieve file');
      }
    }
  };

  const analyseResume = async () => {
    if (!uploadedFileId) return;

    setIsAnalysing(true);
    try {
      const analysisResponse = await axios.get(`http://localhost:5000/resumeBuilder/analysis/${uploadedFileId}`, {
        headers: { jwt_token: localStorage.token }
      });
      setAnalysis(analysisResponse.data.analysis);

      await viewResume(uploadedFileId);
    } catch (error: unknown) {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalysing(false);
    }
  };



  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);




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
        <NavBar isAuthenticated={true} />
      </div>

      <div className='px-4 md:px-8 max-w-2xl mx-auto space-y-4 motion-scale-in-[0.5] motion-translate-x-in-[-1%] motion-translate-y-in-[42%] motion-opacity-in-[0%] motion-blur-in-[5px] motion-duration-[1.00s] motion-duration-[1.50s]/scale motion-duration-[1.50s]/translate'>
        <div className='bg-slate-800/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-emerald-800/30 hover:border-emerald-700/50 transition-all duration-300 mt-20'>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="mb-4 text-emerald-100 w-full"
          />

          <button
            onClick={uploadResume}
            disabled={!file || isUploading}
            className='w-full bg-emerald-700 text-white py-3 rounded-md hover:bg-emerald-600 hover:shadow-lg transition duration-300 font-medium cursor-pointer mb-4'
          >
            {isUploading ? 'Uploading...' : 'Upload Resume'}
          </button>

          <button
            onClick={analyseResume}
            disabled={!uploadedFileId || isAnalysing}
            className='w-full bg-emerald-700 text-white py-3 rounded-md hover:bg-emerald-600 hover:shadow-lg transition duration-300 font-medium cursor-pointer'
          >
            {isAnalysing ? 'Analysing...' : 'Analyse Resume'}
          </button>
          {fileUrl && (
            <div className="mt-4">
              <object
                data={fileUrl}
                type="application/pdf"
                className="w-full h-96 rounded-lg border border-emerald-800/30"
              >
                <p>Unable to display PDF file. <a href={fileUrl}>Download</a> instead.</p>
              </object>
            </div>
          )}
          {error && (
            <div className="mt-4 text-red-300 font-medium">
              {error}
            </div>
          )}
          {analysis && (
            <div className="mt-4 bg-slate-800/80 backdrop-blur-sm p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">AI Analysis Results:</h2>
              <div className="text-emerald-200 whitespace-pre-line space-y-4">
                {typeof analysis === 'string'
                  ? analysis.split('\n').map((line, index) => (
                    <p key={index} className="leading-relaxed">
                      {line}
                    </p>
                  ))
                  : analysis[0] && `${analysis[0].label}: ${Math.round(analysis[0].score * 100)}% confidence`
                }
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
