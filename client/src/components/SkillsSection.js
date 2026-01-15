import React from 'react';

function SkillsSection() {
  const skillCategories = [
    {
      title: 'Graphic Design',
      skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Adobe XD', 'UI/UX Design'],
    },
    {
      title: 'Web Development',
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'PHP', 'Tailwind CSS', 'Java'],
    },
    {
      title: 'Mobile & Databases',
      skills: ['Kotlin', 'MySQL', 'MongoDB', 'Firebase', 'API Development'],
    },
    {
      title: 'Tools & Platforms',
      skills: ['GitHub', 'VS Code', 'IntelliJ IDEA', 'Postman', 'Git', 'Linux'],
    },
  ];

  return (
    <section id="skills" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Skills & Technologies</h2>
          <p className="text-gray-600 text-lg">My expertise in design and development</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>
              <div className="space-y-2">
                {category.skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white text-center">
            <div className="text-5xl font-bold mb-2">2</div>
            <p className="text-lg opacity-90">Professional Domains</p>
            <p className="text-sm opacity-75 mt-2">Graphic Design & Web Development</p>
          </div>
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white text-center">
            <div className="text-5xl font-bold mb-2">15+</div>
            <p className="text-lg opacity-90">Tools & Technologies</p>
            <p className="text-sm opacity-75 mt-2">Industry-standard platforms</p>
          </div>
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white text-center">
            <div className="text-5xl font-bold mb-2">8m</div>
            <p className="text-lg opacity-90">Professional Experience</p>
            <p className="text-sm opacity-75 mt-2">Hands-on industry work</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
