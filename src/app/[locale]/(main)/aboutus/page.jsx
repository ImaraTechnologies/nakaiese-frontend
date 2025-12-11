'use client';

import React from 'react';
import Image from 'next/image';
import {
  Globe,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Container from '@/components/Shared/Container/Container';
import Newsletter from "@/components/Shared/Newsletter/Newsletter";

export default function AboutPage() {
  const t = useTranslations('AboutPage');


  // --- REBUILD DATA INSIDE COMPONENT FOR TRANSLATION ---
  const teamMembers = [
    {
      id: 'amara',
      name: "Amara Diop",
      role: t('Team.members.amara.role'),
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400",
      bio: t('Team.members.amara.bio')
    },
    {
      id: 'david',
      name: "David Kalu",
      role: t('Team.members.david.role'),
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400",
      bio: t('Team.members.david.bio')
    },
    {
      id: 'sarah',
      name: "Sarah Mbeki",
      role: t('Team.members.sarah.role'),
      image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=400&h=400",
      bio: t('Team.members.sarah.bio')
    },
    {
      id: 'james',
      name: "James Osei",
      role: t('Team.members.james.role'),
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400",
      bio: t('Team.members.james.bio')
    }
  ];

  const stats = [
    { id: 1, label: t('Stats.destinations'), value: "50+", icon: Globe },
    { id: 2, label: t('Stats.hotels'), value: "500+", icon: Users },
    { id: 3, label: t('Stats.travelers'), value: "10k+", icon: TrendingUp },
    { id: 4, label: t('Stats.years'), value: "5", icon: Award },
  ];

  const missionPoints = [
    t('Mission.points.verified'),
    t('Mission.points.support'),
    t('Mission.points.price'),
    t('Mission.points.secure')
  ];

  return (
    <div className="bg-white min-h-screen">

      {/* 1. HERO SECTION */}
      <section className="relative bg-blue-900 py-20 lg:py-32 overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />

        <Container>
          <div className="relative z-10 max-w-3xl">
            <span className="text-yellow-400 font-bold uppercase tracking-wider text-sm mb-4 block">
              {t('Hero.eyebrow')}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('Hero.title_part1')} <br />
              <span className="text-yellow-400">{t('Hero.title_highlight')}</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
              {t('Hero.description')}
            </p>
          </div>
        </Container>
      </section>

      {/* 2. MISSION & VALUES */}
      <section className="py-20">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Image Grid */}
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-8">
                <div className="h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600"
                    alt="African Landscape" width={400} height={600} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="h-40 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&w=600"
                    alt="Dining" width={400} height={400} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-40 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600"
                    alt="Hotel Interior" width={400} height={400} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1489367847731-11201704f2f5?auto=format&fit=crop&w=600"
                    alt="Adventure" width={400} height={600} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('Mission.title_part1')} <br />
                <span className="text-blue-900">{t('Mission.title_highlight')}</span>
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {t('Mission.desc_p1')}
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {t('Mission.desc_p2')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {missionPoints.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="text-green-500 w-5 h-5 shrink-0" />
                    <span className="text-gray-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <button className="mt-10 px-8 py-3 bg-blue-900 text-white font-bold rounded-full hover:bg-yellow-400 hover:text-blue-900 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl">
                {t('Mission.cta')} <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </Container>
      </section>

      {/* 3. STATS SECTION */}
      <section className="bg-blue-900 py-16">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-blue-800/50">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center px-4">
                <stat.icon className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-blue-200 text-sm uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. TEAM SECTION */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('Team.title')}</h2>
            <p className="text-gray-600">
              {t('Team.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-blue-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white text-sm">{member.bio}</p>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium text-sm mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. NEWSLETTER / FOOTER CTA */}
      <Container>
        <Newsletter />
      </Container>

    </div>
  );
}