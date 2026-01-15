import React, { useState } from 'react';

function ProjectCard({ project, onProjectClick }) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  // Normalize image path - ensure it starts with /images/ if it's a relative path
  const getImageSrc = () => {
    if (!project.image) return null;
    
    // If it's already a full URL (http/https), use it as is
    if (project.image.startsWith('http://') || project.image.startsWith('https://')) {
      return project.image;
    }
    
    // In development, React serves files from public folder
    // In production, we might need to use the backend server
    let imagePath = project.image;
    
    // Ensure it starts with /images/
    if (!imagePath.startsWith('/images/')) {
      if (imagePath.startsWith('/')) {
        // If it starts with / but not /images/, prepend /images
        imagePath = `/images${imagePath}`;
      } else {
        // If it's just a filename, prepend /images/
        imagePath = `/images/${imagePath}`;
      }
    }
    
    // In development, React dev server serves from public folder
    // So /images/file.jpg works directly
    // In production, if needed, we can prepend the backend URL
    return imagePath;
  };

  // Initialize image source
  React.useEffect(() => {
    if (project.image) {
      const normalized = getImageSrc();
      setImageSrc(normalized);
      setImageError(false);
    } else {
      setImageSrc(null);
    }
  }, [project.image]);

  const hasImage = imageSrc && !imageError;

  const handleCardClick = () => {
    if (onProjectClick) {
      onProjectClick(project._id);
    }
  };

  const isClickable = !!onProjectClick;

  return (
    <div 
      className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 h-full flex flex-col hover:border-primary-200 ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
      title={isClickable ? 'Click to view project details' : ''}
    >
      {/* Image Header */}
      <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
        {hasImage && imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                console.error(`❌ Image failed to load for "${project.title}"`);
                console.error(`Path attempted: ${imageSrc}`);
                console.error('The file does not exist. Please:');
                console.error('1. Go to Admin Dashboard (#/admin)');
                console.error('2. Edit this project');
                console.error('3. Re-upload the image');
                console.error('4. Save the project');
                setImageError(true);
              }}
              onLoad={() => {
                console.log(`✅ Image loaded successfully: ${imageSrc}`);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 opacity-40 group-hover:opacity-20 transition-opacity duration-300"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 opacity-75 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl group-hover:scale-110 transition-transform duration-300">💼</div>
            </div>
          </>
        )}
      </div>
      
      {/* Content */}
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{project.title}</h3>
        <p className="text-gray-600 leading-relaxed mb-6 flex-1">{project.description}</p>
        
        {/* Technologies */}
        {(project.technologies || project.tech) && (project.technologies || project.tech).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {(project.technologies || project.tech).map((tech, index) => (
              <span 
                key={index} 
                className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-primary-200 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Buttons */}
      <div 
        className="px-8 pb-8 flex gap-3 border-t border-gray-100 pt-6"
        onClick={(e) => e.stopPropagation()} // Prevent card click when clicking buttons
      >
        {(project.link || project.live) && (
          <a
            href={project.link || project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
          >
            <span>View Project</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-100 hover:bg-primary-500 text-gray-900 hover:text-white border-2 border-primary-500 font-bold py-3 px-4 rounded-xl text-center transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
