'use client';
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Shield,
  Zap,
  Settings,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  Rocket,
  Code,
  Server,
  Globe,
} from 'lucide-react';

const LMSPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      title: 'Technical Architecture Overview',
      icon: <Server className="w-8 h-8" />,
      content: {
        subtitle: 'Core Technology Stack Decision',
        description:
          'Based on proven enterprise LMS patterns and modern development practices, our technical foundation prioritizes scalability, maintainability, and performance.',
        sections: [
          {
            title: 'Frontend Architecture',
            items: [
              'Next.js 14 with App Router',
              'TypeScript for type safety',
              'Tailwind CSS + shadcn/ui',
              'Zustand + React Query',
              'Socket.io for real-time features',
            ],
          },
          {
            title: 'Backend Architecture',
            items: [
              'Node.js with Express.js',
              'TypeScript throughout',
              'RESTful APIs + GraphQL',
              'JWT + OAuth 2.0 + SSO',
              'AWS S3 + CloudFront CDN',
            ],
          },
          {
            title: 'Infrastructure Foundation',
            items: [
              'AWS Cloud Provider',
              'Docker + Kubernetes',
              'GitHub Actions + AWS CodePipeline',
              'DataDog + Sentry monitoring',
            ],
          },
        ],
      },
    },
    {
      id: 2,
      title: 'Development Tools & AI Integration',
      icon: <Code className="w-8 h-8" />,
      content: {
        subtitle: 'AI-Enhanced Development Workflow',
        description:
          'Leveraging cutting-edge AI tools to accelerate development while maintaining code quality and architectural integrity.',
        sections: [
          {
            title: 'Primary AI Development Tools',
            items: [
              'GitHub Copilot for code completion',
              'ChatGPT/Claude for architecture planning',
              'V0.dev for rapid UI prototyping',
              'Cursor IDE for AI-powered editing',
              'CodeRabbit for automated code review',
            ],
          },
          {
            title: 'Development Acceleration',
            items: [
              'Prisma ORM for type-safe operations',
              'tRPC for end-to-end type safety',
              'shadcn/ui component library',
              'React Hook Form + Zod validation',
              'Recharts for analytics visualization',
            ],
          },
        ],
      },
    },
    {
      id: 3,
      title: 'Database Architecture & Data Strategy',
      icon: <Database className="w-8 h-8" />,
      content: {
        subtitle: 'Multi-layered Data Architecture',
        description:
          'Optimized for LMS-specific patterns: hierarchical course structures, complex user relationships, and real-time analytics.',
        sections: [
          {
            title: 'Primary Database (PostgreSQL)',
            items: [
              'Organizations (multi-tenant)',
              'Users (learners, instructors, admins)',
              'Courses (with versioning)',
              'Lessons (multimedia content)',
              'Assessments & Certificates',
            ],
          },
          {
            title: 'Real-time Data Layer (Redis)',
            items: [
              'Session management',
              'Live notifications',
              'Course progress caching',
              'Real-time collaboration',
              'Rate limiting & throttling',
            ],
          },
          {
            title: 'Search & Analytics',
            items: [
              'Elasticsearch for content search',
              'ClickHouse for analytics',
              'User behavior tracking',
              'Performance metrics',
            ],
          },
        ],
      },
    },
    {
      id: 4,
      title: 'Microservices Architecture & API Design',
      icon: <Globe className="w-8 h-8" />,
      content: {
        subtitle: 'Service-Oriented Architecture',
        description:
          'Breaking down monolithic complexity into manageable, scalable microservices aligned with business domains.',
        sections: [
          {
            title: 'Core Microservices',
            items: [
              'User Management Service',
              'Course Management Service',
              'Learning Engine Service',
              'Assessment Service',
              'Notification Service',
              'Analytics Service',
              'Payment Service',
            ],
          },
          {
            title: 'API Strategy',
            items: [
              'Kong/AWS API Gateway',
              'JWT validation at gateway',
              'REST for CRUD operations',
              'GraphQL for complex queries',
              'WebSockets for real-time',
            ],
          },
        ],
      },
    },
    {
      id: 5,
      title: 'Security Architecture & Compliance',
      icon: <Shield className="w-8 h-8" />,
      content: {
        subtitle: 'Zero-Trust Security Model',
        description:
          'Every request, user, and service is verified and validated regardless of location or previous authentication status.',
        sections: [
          {
            title: 'Authentication & Authorization',
            items: [
              'Multi-Factor Authentication',
              'Single Sign-On (SAML, OAuth 2.0)',
              'Role-Based Access Control',
              'API Security & Rate Limiting',
            ],
          },
          {
            title: 'Data Protection',
            items: [
              'AES-256 encryption at rest',
              'TLS 1.3 in transit',
              'AWS KMS key management',
              'GDPR-compliant handling',
            ],
          },
          {
            title: 'Compliance Framework',
            items: [
              'SOC 2 Type II compliance',
              'GDPR & FERPA compliance',
              'HIPAA for healthcare content',
              '24/7 security monitoring',
            ],
          },
        ],
      },
    },
    {
      id: 6,
      title: 'DevOps & Deployment Strategy',
      icon: <Settings className="w-8 h-8" />,
      content: {
        subtitle: 'CI/CD Pipeline Architecture',
        description:
          'Automated development lifecycle supporting rapid iteration while maintaining production stability.',
        sections: [
          {
            title: 'Development Workflow',
            items: [
              'GitHub Actions automation',
              'Automated testing (Unit, Integration, E2E)',
              'Security scanning (Snyk, OWASP)',
              'Docker containerization',
              'Multi-stage deployments',
            ],
          },
          {
            title: 'Infrastructure as Code',
            items: [
              'Terraform for AWS provisioning',
              'Kubernetes orchestration',
              'Helm Charts for deployments',
              'ArgoCD GitOps automation',
            ],
          },
          {
            title: 'Monitoring & Observability',
            items: [
              'DataDog APM monitoring',
              'Sentry error tracking',
              'ELK Stack logging',
              'Multi-region failover',
            ],
          },
        ],
      },
    },
    {
      id: 7,
      title: 'Integration Architecture',
      icon: <Zap className="w-8 h-8" />,
      content: {
        subtitle: 'Third-Party Ecosystem Integration',
        description:
          'Seamless connectivity with existing enterprise systems and educational technology ecosystem.',
        sections: [
          {
            title: 'Enterprise Integrations',
            items: [
              'HR Systems (Workday, BambooHR)',
              'CRM Platforms (Salesforce, HubSpot)',
              'Video Conferencing (Zoom, Teams)',
              'Content Libraries (Khan Academy, Coursera)',
            ],
          },
          {
            title: 'Payment & Billing',
            items: [
              'Stripe, PayPal, Square',
              'Subscription management',
              'Enterprise billing',
              'Tax compliance automation',
            ],
          },
          {
            title: 'Authentication Providers',
            items: [
              'Enterprise SSO (Okta, Azure AD)',
              'Social Login (Google, Microsoft)',
              'Educational Systems integration',
            ],
          },
        ],
      },
    },
    {
      id: 8,
      title: 'Performance Optimization & Scalability',
      icon: <Rocket className="w-8 h-8" />,
      content: {
        subtitle: 'Enterprise-Scale Performance',
        description:
          'Built for enterprise-scale performance from day one, supporting thousands of concurrent users with sub-second response times.',
        sections: [
          {
            title: 'Frontend Performance',
            items: [
              'Code splitting & dynamic imports',
              'Next.js image optimization',
              'Global CDN via CloudFront',
              'Service worker offline capability',
              'Progressive enhancement',
            ],
          },
          {
            title: 'Backend Optimization',
            items: [
              'Database indexing & query optimization',
              'Connection pooling',
              'Redis-based caching',
              'Gzip/Brotli compression',
            ],
          },
          {
            title: 'Scalability Patterns',
            items: [
              'Auto-scaling based on demand',
              'Load balancing with health checks',
              'Database read replicas',
              'Event-driven architecture',
            ],
          },
        ],
      },
    },
    {
      id: 9,
      title: 'Analytics & Business Intelligence',
      icon: <BarChart3 className="w-8 h-8" />,
      content: {
        subtitle: 'Data-Driven Platform Architecture',
        description:
          'Comprehensive analytics system providing insights for learners, instructors, and administrators.',
        sections: [
          {
            title: 'Learning Analytics Engine',
            items: [
              'Real-time progress tracking',
              'Engagement metrics & patterns',
              'Performance analytics',
              'AI-powered recommendations',
              'Early intervention predictions',
            ],
          },
          {
            title: 'Business Intelligence',
            items: [
              'Revenue analytics & churn analysis',
              'User engagement metrics',
              'Content performance tracking',
              'System performance monitoring',
            ],
          },
          {
            title: 'Predictive Analytics',
            items: [
              'Churn prediction system',
              'Content recommendations',
              'Resource planning',
              'Market trend analysis',
            ],
          },
        ],
      },
    },
    {
      id: 10,
      title: 'Quality Assurance & Testing',
      icon: <CheckCircle className="w-8 h-8" />,
      content: {
        subtitle: 'Comprehensive Testing Framework',
        description:
          'Multi-layered testing approach ensuring platform reliability and user experience quality.',
        sections: [
          {
            title: 'Testing Pyramid',
            items: [
              'Unit Tests (70% coverage)',
              'Integration Tests (20% coverage)',
              'End-to-End Tests (10% coverage)',
              'Performance & Load Testing',
            ],
          },
          {
            title: 'Automated Testing Tools',
            items: [
              'Jest + React Testing Library',
              'Playwright for E2E testing',
              'K6 for performance testing',
              'OWASP ZAP security testing',
            ],
          },
          {
            title: 'AI-Enhanced Testing',
            items: [
              'AI-powered test generation',
              'Visual regression detection',
              'Bug prediction models',
              'Test suite optimization',
            ],
          },
        ],
      },
    },
    {
      id: 11,
      title: 'Team Structure & Development',
      icon: <Users className="w-8 h-8" />,
      content: {
        subtitle: 'Agile Development Organization',
        description:
          'Cross-functional teams optimized for rapid delivery and continuous improvement.',
        sections: [
          {
            title: 'Core Development Teams',
            items: [
              'Frontend: 2 React developers + UI/UX designer',
              'Backend: 2 Node.js developers + DB specialist',
              'DevOps: Infrastructure + Security engineer',
              'Product: Manager + Business analyst',
              'QA: Manual + Automation tester',
            ],
          },
          {
            title: 'Development Methodology',
            items: [
              '2-week sprint cycles',
              'Daily standups & retrospectives',
              'Story estimation & planning',
              'Regular demo sessions',
            ],
          },
          {
            title: 'AI-Assisted Development',
            items: [
              'Pair programming with AI tools',
              'AI-assisted code review',
              'Auto-generated documentation',
              'AI-powered testing',
            ],
          },
        ],
      },
    },
    {
      id: 12,
      title: 'Implementation Timeline',
      icon: <Clock className="w-8 h-8" />,
      content: {
        subtitle: '6-Month MVP Development Plan',
        description:
          'Phased approach balancing speed to market with technical excellence and scalability.',
        sections: [
          {
            title: 'Phase 1: Foundation (Months 1-2)',
            items: [
              'Infrastructure setup & CI/CD',
              'Database schema & migrations',
              'Authentication system',
              'Basic UI component library',
              'Core user management',
            ],
          },
          {
            title: 'Phase 2: Core Platform (Months 3-4)',
            items: [
              'Advanced course builder',
              'Assessment creation system',
              'Progress tracking & analytics',
              'Payment gateway integration',
              'Search functionality',
            ],
          },
          {
            title: 'Phase 3: Enterprise (Months 5-6)',
            items: [
              'Multi-tenant support',
              'Advanced analytics & reporting',
              'Custom branding capabilities',
              'Performance optimization',
              'Security audit & compliance',
            ],
          },
        ],
      },
    },
    {
      id: 13,
      title: 'Ready for Implementation',
      icon: <Rocket className="w-8 h-8" />,
      content: {
        subtitle: 'Comprehensive Architecture Plan',
        description:
          'We have a comprehensive, evidence-based architecture plan that balances cutting-edge technology with proven enterprise patterns.',
        sections: [
          {
            title: 'Next Immediate Steps',
            items: [
              'Final architecture review and approval',
              'Team assembly and tool procurement',
              'Development environment setup',
              'Sprint 1 planning and execution',
            ],
          },
          {
            title: 'Success Metrics',
            items: [
              'Page load times under 2 seconds',
              '99.9% uptime during testing',
              'Support for 1,000+ concurrent users',
              'Complete security audit',
              'Successful beta with 10+ organizations',
            ],
          },
          {
            title: 'Confidence in Success',
            items: [
              'Proven enterprise LMS patterns',
              'Modern development practices',
              'AI-enhanced productivity tools',
              'Comprehensive technical strategy',
            ],
          },
        ],
      },
    },
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 150);
  };

  const goToSlide = (index: any) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 150);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTransitioning]);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
      {/* Header */}
      <div className="fixed top-0  left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">LMS SaaS Architecture</h1>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">
              {currentSlide + 1} / {slides.length}
            </div>
            <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ease-out"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 h-screen flex">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            className={`w-full max-w-6xl transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          >
            {/* Slide Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl">
                  {currentSlideData.icon}
                </div>
              </div>
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentSlideData.title}
              </h2>
              <p className="text-xl text-blue-300 font-medium mb-2">
                {currentSlideData.content.subtitle}
              </p>
              <p className="text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {currentSlideData.content.description}
              </p>
            </div>

            {/* Slide Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentSlideData.content.sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isTransitioning ? 'none' : 'slideInUp 0.6s ease-out forwards',
                  }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-blue-300">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex space-x-3 bg-black/30 backdrop-blur-md rounded-full px-4 py-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-gradient-to-r from-blue-400 to-purple-500 scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide Counter */}
      <div className="fixed bottom-6 right-6 z-50 bg-black/30 backdrop-blur-md rounded-lg px-4 py-2 text-sm">
        Slide {currentSlide + 1} of {slides.length}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LMSPresentation;
