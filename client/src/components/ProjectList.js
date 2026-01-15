import React from 'react';
import ProjectCard from './ProjectCard';

function ProjectList({ projects, onProjectClick }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No projects in this category yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} onProjectClick={onProjectClick} />
      ))}
    </div>
  );
}

export default ProjectList;
