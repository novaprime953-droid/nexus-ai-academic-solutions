import React, { useState } from 'react';
import { COURSES } from '../data/mockData';
import { Course } from '../types';
import { CardTilt } from '../components/CardTilt';
import { ScrollReveal, StaggerItem } from '../components/ScrollReveal';
import { FloatingParticles } from '../components/FloatingParticles';
import { Search, MapPin, Star, Clock, Users, ArrowRight } from 'lucide-react';

interface CoursesPageProps {
  onSelectCourse: (course: Course) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onSelectCourse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [modalityFilter, setModalityFilter] = useState<'all' | 'physical' | 'online'>('all');

  const categories = [
    'All',
    'Artificial Intelligence',
    'Web Development',
    'App Development',
    'AI Automation',
    'Digital Marketing',
    'Graphic Design',
    'SEO',
    'Video Editing',
    'Freelancing',
  ];

  const filteredCourses = COURSES.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesModality =
      modalityFilter === 'all'
        ? true
        : modalityFilter === 'physical'
        ? c.isPhysicalAvailable
        : true;
    return matchesSearch && matchesCat && matchesModality;
  });

  return (
    <div className="relative min-h-screen bg-[#101A3B]/60 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <FloatingParticles count={25} />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <span>Nexus Academic Curriculum</span>
            <span>·</span>
            <span className="text-cyan-400 font-medium">9 Master Programs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Engineering &amp; Digital Innovation Courses
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Rigorous hands-on programs designed by industry leaders. Available online globally and physically at our Cyber Innovation Labs.
          </p>
        </ScrollReveal>

        {/* Filter Controls */}
        <ScrollReveal delay={0.1} className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search curriculum, skills..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-white/5 rounded-xl border border-white/10 w-full lg:w-auto overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Modality toggle */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setModalityFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                modalityFilter === 'all' ? 'bg-white/10 text-white' : 'text-slate-400'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setModalityFilter('physical')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                modalityFilter === 'physical' ? 'bg-white/10 text-cyan-400' : 'text-slate-400'
              }`}
            >
              Physical Lab
            </button>
          </div>
        </ScrollReveal>

        {/* Course Cards Grid with 3D Tilt */}
        <ScrollReveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <StaggerItem key={course.id}>
              <CardTilt
                onClick={() => onSelectCourse(course)}
                className="glass-panel rounded-2xl border border-white/10 glass-panel-hover flex flex-col justify-between overflow-hidden cursor-pointer group"
              >
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-cyan-400 font-semibold">{course.category}</span>
                    <span>{course.level}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {course.tagline}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs text-slate-400 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {course.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      {course.studentsCount}
                    </span>
                  </div>

                  {course.isPhysicalAvailable && (
                    <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/30 border border-cyan-800/30 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">Physical Lab Campus Available</span>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white/[0.02] border-t border-white/8 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Tuition</span>
                    <span className="text-base font-bold text-white">{course.price}</span>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>View Syllabus</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </CardTilt>
            </StaggerItem>
          ))}
        </ScrollReveal>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p>No courses matched your current filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
