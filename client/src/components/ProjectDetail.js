import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectDetail({ projectId, onBack }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/projects/${projectId}`);
        setProject(response.data);
      } catch (err) {
        console.error('Failed to load project:', err);
        setError('Project not found');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const normalizeImagePath = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/images/') || imagePath.startsWith('/pdfs/')) {
      return imagePath;
    }
    if (!imagePath.startsWith('/')) {
      // Determine if it's a PDF or image based on extension
      if (imagePath.toLowerCase().endsWith('.pdf')) {
        return `/pdfs/${imagePath}`;
      }
      return `/images/${imagePath}`;
    }
    return imagePath;
  };

  const imageSrc = project?.image ? normalizeImagePath(project.image) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The project you are looking for does not exist.'}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            ← Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
        {imageSrc && !imageError ? (
          <>
            <img
              src={imageSrc}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <div className="text-8xl">💼</div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4">{project.title}</h1>
          {(project.tech || project.technologies) && (project.tech || project.technologies).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(project.tech || project.technologies).map((tech, index) => (
                <span
                  key={index}
                  className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-4">About This Project</h2>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          {(project.tech || project.technologies) && (project.tech || project.technologies).length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-3">
                {(project.tech || project.technologies).map((tech, index) => (
                  <span
                    key={index}
                    className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-200 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PDF Document Section - For UI/UX Projects */}
          {project.pdf && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Design Document</h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Design Portfolio PDF</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      View the complete design case study and portfolio document
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={normalizeImagePath(project.pdf)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View PDF</span>
                      </a>
                      <a
                        href={normalizeImagePath(project.pdf)}
                        download
                        className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 border-2 border-gray-300 font-bold px-6 py-3 rounded-lg transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Embedded PDF Viewer */}
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-lg bg-white">
                  <iframe
                    src={`${normalizeImagePath(project.pdf)}#toolbar=1&navpanes=1&scrollbar=1`}
                    className="w-full h-[600px] md:h-[800px]"
                    title="Design Portfolio PDF"
                    style={{ border: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gray-100 hover:bg-primary-500 text-gray-900 hover:text-white border-2 border-primary-500 font-bold py-4 px-6 rounded-xl text-center transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>View on GitHub</span>
              </a>
            )}
            {(project.link || project.live) && (
              <a
                href={project.link || project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-4 px-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
              >
                <span>View Live Project</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
