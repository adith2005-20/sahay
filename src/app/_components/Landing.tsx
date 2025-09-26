"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from '@/contexts/LanguageContext';
import { ArrowRight, Target } from 'lucide-react';
import ScrollVelocity from '@/components/ScrollVelocity';

function Landing() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen">
      {/* Simple overlay for readability */}
      <div className="fixed inset-0 z-0 bg-black/10" />

      {/* ScrollVelocity Background Text */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 right-0">
          <ScrollVelocity
            texts={['Quiz', 'Government Schemes', 'ITI', 'Career Development']}
            velocity={20}
            className="text-gray-300/10 font-black text-6xl md:text-7xl"
          />
        </div>
        <div className="absolute top-2/3 left-0 right-0">
          <ScrollVelocity
            texts={['Skills', 'Assessment', 'Growth', 'Opportunities']}
            velocity={-15}
            className="text-gray-300/8 font-black text-4xl md:text-5xl"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.85]">
              <span className="block text-gray-800">SAHAY</span>
              <span className="block bg-gradient-to-r from-orange-800 via-orange-200 to-indigo-700 bg-clip-text text-transparent">
                CAREER
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="space-y-6">
            <p className="text-xl sm:text-2xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover your path through personalized assessments, government schemes, and skill development programs
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="group bg-gray-900 text-white hover:bg-gray-800 font-semibold px-10 py-4 text-lg rounded-full shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-3">
                  Get Started
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </span>
              </Button>
            </Link>

            <Button 
              variant="outline" 
              size="lg"
              className="group border-2 border-gray-400 bg-transparent text-gray-700 hover:bg-gray-100 hover:border-gray-600 hover:text-gray-900 font-semibold px-10 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-3">
                Explore Features
                <Target className="h-5 w-5 transition-transform group-hover:rotate-12" />
              </span>
            </Button>
          </div>

          {/* Feature List */}
          <div className="pt-12">
            <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-base font-light">
              <span className="hover:text-gray-800 transition-colors cursor-default">• Personalized Assessments</span>
              <span className="hover:text-gray-800 transition-colors cursor-default">• Government Schemes</span>
              <span className="hover:text-gray-800 transition-colors cursor-default">• ITI Programs</span>
              <span className="hover:text-gray-800 transition-colors cursor-default">• Skill Development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;