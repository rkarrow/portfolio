import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard({ onProjectAdded }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeProjectTab, setActiveProjectTab] = useState('development'); // Track which project type tab is active
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    github: '',
    link: '',
    image: '',
    pdf: '',
    // "development" | "graphic" | "uiux"
    category: 'development',
  });
  const [techInput, setTechInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);

  // Normalize image path for display
  const normalizeImagePath = (imagePath) => {
    if (!imagePath) return '';
    // If it's already a full URL (http/https), use it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it starts with /images/, use it as is
    if (imagePath.startsWith('/images/')) {
      return imagePath;
    }
    // If it's just a filename, prepend /images/
    if (!imagePath.startsWith('/')) {
      return `/images/${imagePath}`;
    }
    // Otherwise use as is
    return imagePath;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleFileSelect = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Automatically upload the image
      await handleImageUpload(file);
      
      // Reset the file input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleImageUpload = async (fileToUpload = null) => {
    const file = fileToUpload || selectedFile;
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      console.log('📤 Uploading image:', file.name);

      const response = await axios.post('/api/upload/image', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Upload response:', response.data);

      if (response.data.success) {
        const uploadedImagePath = response.data.imagePath;
        console.log('✅ Image uploaded successfully. Path:', uploadedImagePath);
        console.log('✅ Filename:', response.data.filename);
        console.log('📝 Current editingProject:', editingProject);
        console.log('📝 Current formData before update:', formData);
        
        // Update form data with the image path - preserve editingProject state
        // Use functional update to ensure we get the latest state
        setFormData(prev => {
          const updated = {
            ...prev,
            image: uploadedImagePath
          };
          console.log('📝 Updated formData with image:', updated);
          return updated;
        });
        
        // Clear selected file and update preview to show the uploaded image
        setSelectedFile(null);
        setImagePreview(normalizeImagePath(uploadedImagePath));
        
        // Show success message but don't clear editingProject
        setSuccess('✅ Image uploaded automatically! The image is ready. Click "Update Project" button below to save.');
        setTimeout(() => setSuccess(false), 6000);
        
        // Ensure we stay in edit mode and on the correct tab if editing
        if (editingProject) {
          const projectCategory = editingProject.category || 'development';
          // Make sure we're on the correct tab
          if (activeProjectTab !== projectCategory) {
            setActiveProjectTab(projectCategory);
          }
        }
        
        // Verify the image was set (for debugging)
        setTimeout(() => {
          console.log('🔍 Verifying formData.image after upload:', formData.image);
        }, 100);
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to upload image';
      if (err.response?.status === 404) {
        setError('Upload endpoint not found. Please make sure the server is running and restarted.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handlePdfSelect = (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (file) {
      setSelectedPdfFile(file);
    }
  };

  const handlePdfUpload = async () => {
    if (!selectedPdfFile) return;

    setUploadingPdf(true);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('pdf', selectedPdfFile);

      console.log('📤 Uploading PDF:', selectedPdfFile.name);
      console.log('📤 PDF file size:', (selectedPdfFile.size / 1024 / 1024).toFixed(2), 'MB');
      console.log('📤 PDF file type:', selectedPdfFile.type);

      const response = await axios.post('/api/upload/pdf', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ PDF upload response:', response.data);

      if (response.data.success) {
        const uploadedPdfPath = response.data.pdfPath;
        console.log('✅ PDF uploaded successfully. Path:', uploadedPdfPath);
        setFormData(prev => ({
          ...prev,
          pdf: uploadedPdfPath
        }));
        setSelectedPdfFile(null);
        setSuccess('✅ PDF uploaded successfully! Click "Update Project" to save.');
        setTimeout(() => setSuccess(false), 5000);
        
        // Ensure we stay in edit mode and on the correct tab if editing
        if (editingProject) {
          const projectCategory = editingProject.category || 'uiux';
          // Make sure we're on the correct tab
          if (activeProjectTab !== projectCategory) {
            setActiveProjectTab(projectCategory);
          }
        }
      }
    } catch (err) {
      console.error('❌ PDF upload error:', err);
      console.error('❌ Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      let errorMessage = 'Failed to upload PDF';
      if (err.response?.status === 404) {
        errorMessage = 'PDF upload endpoint not found. Please make sure the server is running and restarted.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleRemovePdf = () => {
    setSelectedPdfFile(null);
    setFormData(prev => ({
      ...prev,
      pdf: ''
    }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Use editingProject's category if editing, otherwise use activeProjectTab
      const projectCategory = editingProject 
        ? (editingProject.category || formData.category)
        : (formData.category || activeProjectTab);
      
      // Build payload - ensure we capture the latest formData state
      const payload = {
        title: formData.title,
        description: formData.description,
        technologies: formData.technologies,
        tech: formData.technologies,
        github: formData.github,
        link: formData.link,
        live: formData.link,
        image: formData.image || '', // Always include image field, even if empty
        pdf: formData.pdf || '', // Always include PDF field, even if empty
        category: projectCategory,
      };

      console.log('📤 Submitting project with payload:', payload);
      console.log('📸 Image path being saved:', formData.image || '(no image)');
      console.log('📸 Full formData state:', formData);
      if (!formData.image) {
        console.warn('⚠️ No image provided for this project. Image field will be empty.');
        console.warn('⚠️ If you just uploaded an image, make sure to wait for the success message before clicking Update.');
      } else {
        console.log('✅ Image will be saved:', formData.image);
      }

      const wasEditing = !!editingProject;
      let response;
      if (editingProject) {
        response = await axios.put(`/api/projects/${editingProject._id}`, payload);
        console.log('✅ Project updated. Response:', response.data);
        console.log('📸 Image in response:', response.data.image);
        setSuccess('Project updated successfully!');
      } else {
        response = await axios.post('/api/projects', payload);
        console.log('✅ Project created. Response:', response.data);
        console.log('📸 Image in response:', response.data.image);
        setSuccess('Project created successfully!');
      }
      
      // Reset form with the current active tab's category
      setFormData({
        title: '',
        description: '',
        technologies: [],
        github: '',
        link: '',
        image: '',
        pdf: '',
        category: activeProjectTab,
      });
      setSelectedFile(null);
      setImagePreview('');
      setSelectedPdfFile(null);
      setEditingProject(null);
      fetchProjects();
      
      // Only call onProjectAdded for new projects, not when editing
      if (onProjectAdded && !wasEditing) {
        onProjectAdded(response.data);
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    const projectCategory = project.category || 'development';
    setFormData({
      title: project.title || '',
      description: project.description || '',
      technologies: project.tech || project.technologies || [],
      github: project.github || '',
      link: project.live || project.link || '',
      image: project.image || '',
      pdf: project.pdf || '',
      category: projectCategory,
    });
    setSelectedFile(null);
    setSelectedPdfFile(null);
    // Set preview to existing image if available
    if (project.image) {
      setImagePreview(normalizeImagePath(project.image));
    } else {
      setImagePreview('');
    }
    setActiveProjectTab(projectCategory); // Switch to the correct tab
    setActiveSection('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      technologies: [],
      github: '',
      link: '',
      image: '',
      pdf: '',
      category: activeProjectTab,
    });
    setSelectedFile(null);
    setImagePreview('');
    setSelectedPdfFile(null);
  };

  // Helper function to render project form and list for a specific category
  const renderProjectCategory = (category, categoryLabel, categoryIcon) => {
    const categoryProjects = projects.filter(p => {
      if (category === 'development') {
        return !p.category || p.category === 'development';
      }
      return p.category === category;
    });

    return (
      <div className="space-y-8">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{categoryIcon}</span>
            <h3 className="text-2xl font-bold text-gray-900">
              {editingProject && editingProject.category === category ? 'Edit Project' : `Create New ${categoryLabel}`}
            </h3>
          </div>
          
          {error && (!editingProject || editingProject.category === category) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (!editingProject || editingProject.category === category) && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✅ {success}
            </div>
          )}

          {/* Show form if: creating new project OR editing project in this category */}
          {/* When editing, ensure we're on the correct tab to prevent form from disappearing */}
          {(!editingProject || editingProject.category === category) && (
            <form onSubmit={(e) => {
              e.preventDefault();
              // Ensure category matches the active tab when creating (not editing)
              if (!editingProject && formData.category !== category) {
                setFormData(prev => ({ ...prev, category }));
                // Submit after state update
                setTimeout(() => handleSubmit(e), 10);
                return;
              }
              handleSubmit(e);
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Project Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter project title"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Technologies / Tools</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                      placeholder="Add technology or tool"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    />
                    <button
                      type="button"
                      onClick={handleAddTechnology}
                      className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechnology(tech)}
                          className="hover:text-primary-900 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter project description"
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Cover Photo</label>
                
                {/* Show file input if no image is set or if user wants to change */}
                {(!formData.image || selectedFile) && (
                  <div className="space-y-3">
                    {selectedFile ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                              <p className="text-white font-semibold">Uploading...</p>
                            </div>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setImagePreview(formData.image ? normalizeImagePath(formData.image) : '');
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                          title="Cancel"
                          disabled={uploadingImage}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-3">
                          <label className="flex-1 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                            <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors text-center">
                              <span className="text-primary-600 font-semibold">Choose Image</span>
                              <span className="text-gray-500 text-sm block mt-1">or drag and drop</span>
                            </div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-500">
                          Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Show uploaded/existing image */}
                {formData.image && !selectedFile && (
                  <div className="space-y-3">
                    <div className="relative">
                      <img
                        src={normalizeImagePath(formData.image)}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          console.error('AdminDashboard: Image failed to load:', normalizeImagePath(formData.image));
                          e.target.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('✅ Image preview loaded successfully:', formData.image);
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-semibold">
                        ✅ Image ready! Click "Update Project" or "Create Project" to save.
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Path: {formData.image}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <div className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-center transition-colors">
                          Change Image
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* PDF Upload Section - Only for UI/UX Design Projects */}
              {category === 'uiux' && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Design PDF Document</label>
                  <p className="text-sm text-gray-500 mb-3">
                    Upload a PDF file showcasing your UI/UX design work (case study, portfolio, etc.)
                  </p>
                  
                  {/* Show file input if no PDF is set or if user wants to change */}
                  {(!formData.pdf || selectedPdfFile) && (
                    <div className="space-y-3">
                      {selectedPdfFile ? (
                        <>
                          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{selectedPdfFile.name}</p>
                                <p className="text-sm text-gray-500">{(selectedPdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedPdfFile(null)}
                                className="text-red-500 hover:text-red-700"
                                title="Cancel"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handlePdfUpload}
                            disabled={uploadingPdf}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {uploadingPdf ? 'Uploading PDF...' : 'Upload PDF'}
                          </button>
                        </>
                      ) : (
                        <>
                          <label 
                            className="flex-1 cursor-pointer"
                            htmlFor="pdf-file-input"
                          >
                            <input
                              id="pdf-file-input"
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={handlePdfSelect}
                              className="hidden"
                            />
                            <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-center">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <span className="text-blue-600 font-semibold">Choose PDF File</span>
                              <span className="text-gray-500 text-sm block mt-1">or drag and drop</span>
                            </div>
                          </label>
                          <p className="text-sm text-gray-500">
                            Supported format: PDF (max 50MB)
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Show uploaded/existing PDF */}
                  {formData.pdf && !selectedPdfFile && (
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="font-semibold text-green-900">PDF Document Ready</p>
                            <p className="text-sm text-green-700">{formData.pdf}</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemovePdf}
                            className="text-red-500 hover:text-red-700"
                            title="Remove PDF"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <label 
                          className="flex-1 cursor-pointer"
                          htmlFor="pdf-change-input"
                        >
                          <input
                            id="pdf-change-input"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handlePdfSelect}
                            className="hidden"
                          />
                          <div className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-center transition-colors">
                            Change PDF
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {category === 'development' ? 'GitHub Repository' : 'Portfolio Link'}
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder={category === 'development' ? 'https://github.com/username/repo' : 'https://behance.net/...'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Live Project Link</label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? 'Saving...' : editingProject ? 'Update Project' : `Create ${categoryLabel}`}
                </button>
                {/* Show Cancel button when editing - check both category match and if editingProject exists */}
                {editingProject && (editingProject.category === category || editingProject) && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {categoryLabel} Projects ({categoryProjects.length})
            </h3>
          </div>
          
          {categoryProjects.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No {categoryLabel.toLowerCase()} projects yet. Create your first one above!</p>
          ) : (
            <div className="space-y-4">
              {categoryProjects.map((project) => (
                <div key={project._id} className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{project.title}</h4>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.description}</p>
                    {(project.tech || project.technologies) && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(project.tech || project.technologies || []).map((tech, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 mt-3 text-sm">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-semibold">
                          {category === 'development' ? 'GitHub' : 'Portfolio'} →
                        </a>
                      )}
                      {(project.live || project.link) && (
                        <a href={project.live || project.link} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-semibold">
                          Live Demo →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${projectId}`);
        fetchProjects();
        if (editingProject && editingProject._id === projectId) {
          handleCancelEdit();
        }
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  // Calculate statistics
  const stats = {
    totalProjects: projects.length,
    totalTechnologies: [...new Set(projects.flatMap(p => p.tech || p.technologies || []))].length,
    projectsWithGithub: projects.filter(p => p.github).length,
    projectsWithLiveLink: projects.filter(p => p.live || p.link).length,
  };

  // Get technology frequency
  const techFrequency = projects.reduce((acc, project) => {
    (project.tech || project.technologies || []).forEach(tech => {
      acc[tech] = (acc[tech] || 0) + 1;
    });
    return acc;
  }, {});

  const topTechnologies = Object.entries(techFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white shadow-lg fixed h-full overflow-y-auto z-50 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500 mt-1">Portfolio Management</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setError(null);
                setSuccess(false);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                activeSection === item.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            onClick={() => window.location.hash = '#/'}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            ← Back to Portfolio
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:text-gray-900"
          >
            <span className="text-2xl">☰</span>
          </button>
          <h1 className="text-xl font-black text-gray-900">Admin Panel</h1>
          <div className="w-8" />
        </div>
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-2">Dashboard Overview</h2>
              <p className="text-gray-600">Welcome to your portfolio admin dashboard</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Total Projects</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{stats.totalProjects}</p>
                  </div>
                  <div className="text-4xl">💼</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Technologies</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{stats.totalTechnologies}</p>
                  </div>
                  <div className="text-4xl">🛠️</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">GitHub Links</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{stats.projectsWithGithub}</p>
                  </div>
                  <div className="text-4xl">🔗</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Live Projects</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{stats.projectsWithLiveLink}</p>
                  </div>
                  <div className="text-4xl">🌐</div>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Projects</h3>
              {projects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No projects yet. Create your first project!</p>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{project.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{project.description}</p>
                      </div>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="ml-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div>
            <div className="mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-2">Project Management</h2>
              <p className="text-gray-600">Create and manage projects by category</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => {
                    setActiveProjectTab('development');
                    if (!editingProject) {
                      setFormData(prev => ({ ...prev, category: 'development' }));
                    }
                    setError(null);
                    setSuccess(false);
                  }}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeProjectTab === 'development'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  💻 Development Projects
                </button>
                <button
                  onClick={() => {
                    setActiveProjectTab('graphic');
                    if (!editingProject) {
                      setFormData(prev => ({ ...prev, category: 'graphic' }));
                    }
                    setError(null);
                    setSuccess(false);
                  }}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeProjectTab === 'graphic'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  🎨 Graphic Design
                </button>
                <button
                  onClick={() => {
                    setActiveProjectTab('uiux');
                    if (!editingProject) {
                      setFormData(prev => ({ ...prev, category: 'uiux' }));
                    }
                    setError(null);
                    setSuccess(false);
                  }}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeProjectTab === 'uiux'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  🎯 UI/UX Design
                </button>
              </div>
            </div>

            {/* Render the active tab's content */}
            {activeProjectTab === 'development' && renderProjectCategory('development', 'Development', '💻')}
            {activeProjectTab === 'graphic' && renderProjectCategory('graphic', 'Graphic Design', '🎨')}
            {activeProjectTab === 'uiux' && renderProjectCategory('uiux', 'UI/UX Design', '🎯')}
          </div>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <div>
            <div className="mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-2">Analytics & Insights</h2>
              <p className="text-gray-600">View statistics and trends for your portfolio</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technology Distribution</h3>
                {topTechnologies.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No technologies yet</p>
                ) : (
                  <div className="space-y-4">
                    {topTechnologies.map(([tech, count]) => {
                      const percentage = (count / projects.length) * 100;
                      return (
                        <div key={tech}>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold text-gray-700">{tech}</span>
                            <span className="text-gray-500">{count} {count === 1 ? 'project' : 'projects'}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Project Links Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <span className="font-semibold text-gray-700">Projects with GitHub</span>
                    </div>
                    <span className="text-2xl font-black text-gray-900">{stats.projectsWithGithub}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌐</span>
                      <span className="font-semibold text-gray-700">Projects with Live Links</span>
                    </div>
                    <span className="text-2xl font-black text-gray-900">{stats.projectsWithLiveLink}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <span className="font-semibold text-gray-700">Total Projects</span>
                    </div>
                    <span className="text-2xl font-black text-gray-900">{stats.totalProjects}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">All Technologies</h3>
              {stats.totalTechnologies === 0 ? (
                <p className="text-gray-500 text-center py-8">No technologies added yet</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {Object.entries(techFrequency)
                    .sort(([, a], [, b]) => b - a)
                    .map(([tech, count]) => (
                      <div
                        key={tech}
                        className="px-4 py-2 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg border border-primary-300"
                      >
                        <span className="font-semibold text-primary-900">{tech}</span>
                        <span className="ml-2 text-sm text-primary-700">({count})</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div>
            <div className="mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-2">Settings</h2>
              <p className="text-gray-600">Configure your admin dashboard preferences</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">General Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Portfolio Title</label>
                    <input
                      type="text"
                      defaultValue="My Portfolio"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Default Theme</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>Auto</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Project Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">Auto-refresh Projects</p>
                      <p className="text-sm text-gray-500">Automatically refresh project list after changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive email when projects are created or updated</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">System Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Total Projects</span>
                    <span className="font-semibold text-gray-900">{stats.totalProjects}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Total Technologies</span>
                    <span className="font-semibold text-gray-900">{stats.totalTechnologies}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">API Status</span>
                    <span className="font-semibold text-green-600">✓ Online</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Dashboard Version</span>
                    <span className="font-semibold text-gray-900">v2.0</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Danger Zone</h3>
                <div className="space-y-4">
                  <button className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">
                    Clear All Projects
                  </button>
                  <button className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
