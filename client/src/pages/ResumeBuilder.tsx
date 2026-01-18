import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { Card, CardBody, Button, Progress } from "@heroui/react";

const ResumeBuilder = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
      const uploadResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/resumeBuilder/upload`, formData, {
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
      setUploadSuccess(true);
    } catch (error: unknown) {
      setError("Upload failed. Please try again.");
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const viewResume = async (fileId: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/resumeBuilder/file/${fileId}`, {
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
      const analysisResponse = await axios.get(`${import.meta.env.VITE_API_URL}/resumeBuilder/analysis/${uploadedFileId}`, {
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
    <div className='min-h-screen flex-col justify-center pb-4 text-white'>
      <div className='p-8 rounded-lg text-center mb-4'>
        <h1 className='text-6xl font-bold text-white'>Insight</h1>
        <h2 className="text-xl mt-4 text-emerald-400">Resume Analysis</h2>
        <div className='text-center pt-8 text-emerald-400 font-medium italic'>
          Let AI enhance your resume for better job matches
        </div>
      </div>

      <div className='flex justify-center pb-4'>
        <NavBar isAuthenticated={true} />
      </div>

      <div className='px-4 md:px-8 max-w-6xl mx-auto space-y-4 motion-scale-in-[0.5] motion-translate-x-in-[-1%] motion-translate-y-in-[42%] motion-opacity-in-[0%] motion-blur-in-[5px] motion-duration-[1.00s] motion-duration-[1.50s]/scale motion-duration-[1.50s]/translate'>
        <Card className='bg-zinc-900/80 backdrop-blur-sm p-8 border border-emerald-800/30 hover:border-emerald-700/50 transition-all duration-300 mt-20'>
          <CardBody>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label className="group relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="py-2.5 px-6 rounded-full bg-emerald-600/20 text-emerald-400 font-semibold border border-emerald-500/30 transition-all duration-300 group-hover:bg-emerald-600/30 group-hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
                    Choose File
                  </div>
                </label>
                <span className="text-sm text-zinc-400 font-medium transition-all duration-300">
                  {file ? (
                    <span className="text-emerald-400/80 animate-in fade-in slide-in-from-left-2">
                      {file.name}
                    </span>
                  ) : (
                    "No file chosen"
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={uploadResume}
                  disabled={!file || isUploading || uploadSuccess}
                  color={uploadSuccess ? "success" : "primary"}
                  variant={uploadSuccess ? "flat" : "solid"}
                  className={`font-bold rounded-xl h-14 transition-all duration-300 ease-in-out transform active:scale-[0.98] ${uploadSuccess
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-emerald-700 hover:bg-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/20"
                    }`}
                  isLoading={isUploading}
                  size="lg"
                >
                  {uploadSuccess ? 'Resume Uploaded Successfully!' : 'Upload Resume'}
                </Button>

                <Button
                  onClick={analyseResume}
                  disabled={!uploadedFileId || isAnalysing}
                  color="secondary"
                  variant="solid"
                  className="bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl h-14 transition-all duration-300 ease-in-out transform active:scale-[0.98] hover:shadow-lg hover:shadow-purple-500/20"
                  isLoading={isAnalysing}
                  size="lg"
                >
                  {isAnalysing ? 'Analysing...' : 'Analyse Resume'}
                </Button>
              </div>

              {isAnalysing && (
                <Progress
                  size="sm"
                  isIndeterminate
                  aria-label="Analysing..."
                  className="max-w-md mx-auto mt-2"
                  color="secondary"
                />
              )}

              {error && (
                <div className="mt-4 p-4 rounded-lg bg-red-900/20 border border-red-500/30 text-red-300 font-medium text-center">
                  {error}
                </div>
              )}

              {(fileUrl || analysis) && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {fileUrl && (
                    <div className="flex flex-col">
                      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        📄 Resume Preview
                      </h2>
                      <div className="rounded-xl overflow-hidden border border-emerald-800/30 bg-zinc-950">
                        <object
                          data={fileUrl}
                          type="application/pdf"
                          className="w-full h-[600px]"
                        >
                          <embed
                            src={fileUrl}
                            type='application/pdf'
                            className='w-full h-full'
                          />
                          <p className="p-8 text-center">Unable to display PDF file. <a href={fileUrl} className="text-emerald-400 underline">Download</a> instead.</p>
                        </object>
                      </div>
                    </div>
                  )}

                  {analysis && (
                    <div className="flex flex-col">
                      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        🤖 AI Analysis Results
                      </h2>
                      <div className="bg-zinc-950/50 p-6 rounded-xl border border-purple-500/20 h-[600px] overflow-y-auto">
                        <div className="text-emerald-100 whitespace-pre-line text-lg leading-relaxed">
                          {typeof analysis === 'string'
                            ? analysis.split('\n').map((line, index) => (
                              <p key={index} className={line.trim().startsWith('-') || line.trim().match(/^\d\./) ? "ml-4 mb-2" : "mb-4"}>
                                {line}
                              </p>
                            ))
                            : analysis[0] && `${analysis[0].label}: ${Math.round(analysis[0].score * 100)}% confidence`
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ResumeBuilder;
