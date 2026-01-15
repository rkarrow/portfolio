import React from 'react';

function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 md:order-1">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src="/images/profile.jpg"
                alt="Rashmika Kavindu"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-purple-500/20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl border-8 border-white shadow-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-1">⚡</div>
                <div className="text-white text-xs font-bold">Creative</div>
              </div>
            </div>
          </div>

          <div className="space-y-8 order-1 md:order-2">
            <div>
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">About Me</span>
              <h2 className="text-5xl font-black text-gray-900 mb-6">Crafting Digital Experiences</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                I'm Rashmika Kavindu, a passionate Software Engineering undergraduate at SLIIT with 8+ months of professional industry experience. I specialize in creating visually appealing, user-friendly designs while delivering efficient and scalable technical solutions.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                My unique blend of graphic design expertise and software development skills allows me to bridge the gap between aesthetics and functionality, creating digital experiences that are both beautiful and performant.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 rounded-xl border-2 border-primary-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl font-black text-primary-600 mb-2">15+</div>
                <p className="text-gray-700 font-semibold">Projects Completed</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl font-black text-purple-600 mb-2">8m+</div>
                <p className="text-gray-700 font-semibold">Experience</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl font-black text-blue-600 mb-2">2</div>
                <p className="text-gray-700 font-semibold">Expertise Domains</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-red-50 p-6 rounded-xl border-2 border-pink-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl font-black text-pink-600 mb-2">100%</div>
                <p className="text-gray-700 font-semibold">Client Focused</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <p className="text-lg font-semibold flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <span>Focused on quality, performance, and client satisfaction in every project.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
