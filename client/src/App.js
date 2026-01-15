import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectList from './components/ProjectList';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import AdminDashboard from './components/AdminDashboard';
import ProjectDetail from './components/ProjectDetail';

// Configure axios - use environment variable for API URL
// For Netlify: Set REACT_APP_API_URL in Netlify dashboard (Site settings > Environment variables)
// Example: https://your-backend-app.onrender.com or https://your-backend.railway.app
if (process.env.REACT_APP_API_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
} else if (process.env.NODE_ENV === 'production') {
  // Fallback - should be set via environment variable in production
  console.warn('⚠️ REACT_APP_API_URL not set. Please configure it in Netlify environment variables.');
  axios.defaults.baseURL = 'https://your-backend-url.onrender.com'; // Update this with your backend URL
}
// In development, relative URLs will use the proxy defined in package.json

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects');
      console.log('📥 Fetched projects:', response.data);
      response.data.forEach(project => {
        if (project.image) {
          console.log(`📸 Project "${project.title}" has image: "${project.image}"`);
        } else {
          console.log(`⚠️ Project "${project.title}" has NO image`);
        }
      });
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectAdded = (newProject) => {
    setProjects([...projects, newProject]);
    fetchProjects();
  };

  // Check URL hash for routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/admin') {
        setIsAdminView(true);
        setSelectedProjectId(null);
      } else if (hash.startsWith('#/project/')) {
        const projectId = hash.replace('#/project/', '');
        setSelectedProjectId(projectId);
        setIsAdminView(false);
      } else {
        setIsAdminView(false);
        setSelectedProjectId(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleBackToProjects = () => {
    window.location.hash = '';
    setSelectedProjectId(null);
    // Scroll to projects section
    setTimeout(() => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (isAdminView) {
    return <AdminDashboard onProjectAdded={handleProjectAdded} />;
  }

  if (selectedProjectId) {
    return <ProjectDetail projectId={selectedProjectId} onBack={handleBackToProjects} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        
        <section id="projects" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">My Work</span>
              <h2 className="text-5xl font-black text-gray-900 mb-4">Featured Projects</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Explore some of my recent work combining development, graphic design, and UI/UX.</p>
            </div>

            {loading && <div className="text-center py-10 text-primary-500 text-lg">Loading projects...</div>}

            {!loading && (
              <div className="space-y-16">
                {/* Development Projects */}
                <div>
                  <div className="flex items-baseline justify-between mb-6">
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900">Development Projects</h3>
                    <span className="text-sm text-gray-500">
                      {(projects || []).filter(
                        (p) => !p.category || p.category === 'development'
                      ).length}{' '}
                      projects
                    </span>
                  </div>
                  <ProjectList
                    projects={(projects || []).filter(
                      (p) => !p.category || p.category === 'development'
                    )}
                    onProjectClick={(projectId) => {
                      window.location.hash = `#/project/${projectId}`;
                    }}
                  />
                </div>

                {/* Graphic Design Projects */}
                <div>
                  <div className="flex items-baseline justify-between mb-6">
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900">Graphic Design</h3>
                    <span className="text-sm text-gray-500">
                      {(projects || []).filter((p) => p.category === 'graphic').length}{' '}
                      projects
                    </span>
                  </div>
                  <ProjectList
                    projects={(projects || []).filter(
                      (p) => p.category === 'graphic'
                    )}
                    onProjectClick={(projectId) => {
                      window.location.hash = `#/project/${projectId}`;
                    }}
                  />
                </div>

                {/* UI/UX Design Projects */}
                <div>
                  <div className="flex items-baseline justify-between mb-6">
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900">UI/UX Design</h3>
                    <span className="text-sm text-gray-500">
                      {(projects || []).filter((p) => p.category === 'uiux').length}{' '}
                      projects
                    </span>
                  </div>
                  <ProjectList
                    projects={(projects || []).filter(
                      (p) => p.category === 'uiux'
                    )}
                    onProjectClick={(projectId) => {
                      window.location.hash = `#/project/${projectId}`;
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <SkillsSection />
        <ContactSection />
      </main>

      {/* Admin Button - Hidden in footer */}
      <footer className="bg-gray-900 text-center py-8">
        <button
          onClick={() => window.location.hash = '#/admin'}
          className="text-gray-400 hover:text-primary-400 text-sm transition-colors underline"
        >
          Admin
        </button>
      </footer>
    </div>
  );
}

export default App;
