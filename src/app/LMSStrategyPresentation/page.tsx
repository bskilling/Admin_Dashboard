'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  BarChart3,
  Shield,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Target,
  Rocket,
  Settings,
} from 'lucide-react';

const LMSStrategyPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const slides = [
    {
      id: 1,
      title: 'Introduction & Market Context',
      subtitle: "Today's Critical Decision",
      icon: <Target className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-lg text-blue-900 mb-3">The Stakes Are High</h3>
            <p className="text-blue-800">
              We're making a technology choice that will define our competitive advantage for the
              next 5-10 years. The LMS market is experiencing unprecedented growth - expected to
              grow at a CAGR of 17.39% through 2030.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h4 className="font-semibold text-gray-800 mb-3">Current Landscape Reality</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 70% of new applications will use low-code by 2025</li>
                <li>• Yet 78% migrate to custom solutions at scale</li>
                <li>• Enterprise applications require different approaches</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h4 className="font-semibold text-gray-800 mb-3">Key Question</h4>
              <p className="text-sm text-gray-600">
                Should we build using proven custom development (Next.js + Express) or join the
                low-code wave that promises faster delivery but may limit long-term potential?
              </p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
            <p className="text-amber-800 font-medium">
              Impact Areas: Scalability • Security • Client Satisfaction • Market Competition
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Our LMS Vision vs. Market Reality',
      subtitle: 'Competing with Industry Giants',
      icon: <Rocket className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-purple-900 mb-3">Ambitious Product Goals</h3>
            <p className="text-purple-800">
              Our LMS isn't just another learning platform - it's positioned to compete with
              industry leaders like Canvas and Moodle (300M+ users) while offering superior
              enterprise customization.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Technical Requirements</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm">10,000+ concurrent users, sub-2s response</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">SOC 2 compliance, enterprise security</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">Real-time features, AI integration ready</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Integration Ecosystem</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-gray-50 rounded text-center">CRM Systems</div>
                <div className="p-2 bg-gray-50 rounded text-center">Payment Processors</div>
                <div className="p-2 bg-gray-50 rounded text-center">Email Automation</div>
                <div className="p-2 bg-gray-50 rounded text-center">Analytics Platforms</div>
                <div className="p-2 bg-gray-50 rounded text-center">Enterprise SSO</div>
                <div className="p-2 bg-gray-50 rounded text-center">Modern APIs</div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="text-red-800 font-medium">
              Business Reality: 99.9% uptime required, competing against platforms with decades of
              development investment
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "CEO's Vision & Market Context",
      subtitle: 'Understanding the AI Revolution',
      icon: <TrendingUp className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-green-900 mb-3">
              AI Development Revolution (2025 Reality)
            </h3>
            <p className="text-green-800">
              The vision is valid - low-code solutions can reduce development time by 60%, and AI
              tools are genuinely transforming how developers work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-medium text-gray-800 mb-2">Google Stitch</h4>
              <p className="text-xs text-gray-600">
                AI-powered app generation with natural language inputs
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-medium text-gray-800 mb-2">StackBlitz Bolt</h4>
              <p className="text-xs text-gray-600">AI-assisted coding with instant deployment</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-medium text-gray-800 mb-2">OutSystems/Mendix</h4>
              <p className="text-xs text-gray-600">Enterprise low-code platforms</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-3">Market Growth Validation</h4>
            <p className="text-orange-800 mb-3">
              Low-code market projected to reach $248.1B by 2033, growing at 26.1% CAGR
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-orange-600">60%</div>
                <div className="text-orange-700">Time Reduction</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600">40%</div>
                <div className="text-orange-700">GitHub Copilot Gains</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600">56%</div>
                <div className="text-orange-700">Faster Delivery</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600">80%</div>
                <div className="text-orange-700">Non-dev Built</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Where AI/Low-Code Tools Excel',
      subtitle: 'Proven Success Areas',
      icon: <CheckCircle className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800">
                Rapid Prototyping & Validation
              </h3>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <p className="text-green-800 font-medium">58% revenue increase</p>
                <p className="text-green-700 text-sm">
                  for companies using low-code for customer-facing apps
                </p>
              </div>

              <h4 className="font-medium text-gray-700">AI Development Acceleration</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>GitHub Copilot: 40% faster routine coding</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>ChatGPT/Claude: Architecture planning assistance</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>AI Testing: Automated test case generation</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800">Success Stories</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800">Internal Tools</h4>
                  <p className="text-blue-700 text-sm">
                    HR portals, marketing dashboards, workflow automation
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800">MVP Development</h4>
                  <p className="text-purple-700 text-sm">
                    Market validation, simple customer portals
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <h4 className="font-medium text-indigo-800">Process Automation</h4>
                  <p className="text-indigo-700 text-sm">Approval workflows, data pipelines</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Cost & Speed Benefits</h4>
            <p className="text-blue-800">
              Low-code platforms can potentially shave 50-90% off development time vs. traditional
              methods for appropriate use cases.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'The Enterprise LMS Problem',
      subtitle: 'Research Evidence on Limitations',
      icon: <AlertTriangle className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <h4 className="font-semibold text-red-800 mb-2">Deep Customization Limitations</h4>
                <p className="text-red-700 text-sm">
                  Enterprise LMS requires complex permission systems, custom learning paths,
                  advanced analytics that pre-built components cannot accommodate.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-2">Security & Compliance Gaps</h4>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• Incomplete audit trails</li>
                  <li>• Limited code-level documentation</li>
                  <li>• Data residency requirements</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Proven Scalability Bottlenecks
                </h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Performance degrades with complex workflows</li>
                  <li>• Limited database optimization</li>
                  <li>• Auto-scaling doesn't handle LMS load patterns</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-2">Vendor Lock-in Risks</h4>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Platform changes break functionality</li>
                  <li>• Migration costs exceed savings</li>
                  <li>• Pricing becomes prohibitive at scale</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-3">Integration Complexity Evidence</h4>
            <p className="text-gray-700">
              Integrating low-code with existing systems is challenging. Predefined integration
              points don't align with unique organizational infrastructure requirements.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Real-World Evidence & Market Analysis',
      subtitle: "Industry Leaders' Choices",
      icon: <BarChart3 className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-indigo-900 mb-4">
              Industry Leaders' Architecture Choices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-indigo-800 mb-2">Moodle</h4>
                <p className="text-sm text-indigo-700">Custom PHP architecture</p>
                <p className="text-xs text-indigo-600">300M+ users globally</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-indigo-800 mb-2">Canvas</h4>
                <p className="text-sm text-indigo-700">Ruby on Rails + PostgreSQL</p>
                <p className="text-xs text-indigo-600">Major universities</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-indigo-800 mb-2">Blackboard</h4>
                <p className="text-sm text-indigo-700">Enterprise custom solution</p>
                <p className="text-xs text-indigo-600">Open architecture</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 text-2xl mb-2">78%</h4>
              <p className="text-red-700 font-medium">
                of companies using low-code for mission-critical applications eventually migrate to
                custom solutions
              </p>
              <p className="text-red-600 text-sm mt-2">when they scale beyond 1,000 users</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-800 text-2xl mb-2">44%</h4>
              <p className="text-orange-700 font-medium">
                of companies express desire for more customization
              </p>
              <p className="text-orange-600 text-sm mt-2">from their current LMS solutions</p>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Enterprise Requirements Reality</h4>
            <p className="text-gray-700">
              No major LMS serving enterprise clients (10K+ users) relies primarily on low-code
              infrastructure. Performance, customization, and security requirements inevitably
              demand custom solutions.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'Our Strategic Recommendation',
      subtitle: 'Evidence-Based Architecture',
      icon: <Settings className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-emerald-900 mb-3">
              Core Architecture Strategy
            </h3>
            <p className="text-emerald-800 mb-4">
              Build on the same foundation as successful LMS platforms
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                  <h4 className="font-medium text-blue-800">Frontend</h4>
                  <p className="text-sm text-blue-700">Next.js for optimal performance & SEO</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-green-400">
                  <h4 className="font-medium text-green-800">Backend</h4>
                  <p className="text-sm text-green-700">Express.js with TypeScript</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                  <h4 className="font-medium text-purple-800">Database</h4>
                  <p className="text-sm text-purple-700">PostgreSQL + Redis caching</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                  <h4 className="font-medium text-orange-800">Cloud</h4>
                  <p className="text-sm text-orange-700">AWS/Azure with auto-scaling</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h4 className="font-semibold text-gray-800 mb-3">Modular Design Principles</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• RBAC system matching enterprise standards</li>
                <li>• Plugin architecture (inspired by Moodle's 1500+ plugins)</li>
                <li>• API-first design for seamless integrations</li>
                <li>• Microservices for critical components</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h4 className="font-semibold text-gray-800 mb-3">Security by Design</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• End-to-end encryption for sensitive data</li>
                <li>• Comprehensive audit logging</li>
                <li>• Regular security penetration testing</li>
                <li>• SOC 2, GDPR compliance ready</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-800">Development Timeline</h4>
            <p className="text-blue-700">
              6-month MVP with core functionality, followed by iterative 2-week releases - matching
              successful SaaS cycles
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: 'Hybrid AI-Assisted Workflow',
      subtitle: 'Best of Both Worlds',
      icon: <Zap className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-violet-900 mb-3">
              Strategic AI Integration (2025 Approach)
            </h3>
            <p className="text-violet-800">
              We're not rejecting AI tools - we're using them strategically where they provide
              maximum value while maintaining control over critical components.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">AI Development Acceleration</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">GitHub Copilot: 40% faster routine coding</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">ChatGPT/Claude: Architecture planning assistance</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">AI Testing: Automated test generation</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm">Code Analysis: AI security scanning</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Low-Code for Supporting Systems</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">ToolJet: Internal analytics panels</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm">WeWeb: Client onboarding interfaces</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">Zapier: Workflow automation</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-cyan-50 rounded-lg">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-sm">Grafana: AI-powered insights</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg">
            <h4 className="font-semibold text-emerald-900 mb-3">Hybrid Development Benefits</h4>
            <p className="text-emerald-800 mb-3">
              Organizations build solutions 56% faster when combining approaches strategically
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="bg-white px-3 py-1 rounded-full text-emerald-700">
                Risk Mitigation
              </div>
              <div className="bg-white px-3 py-1 rounded-full text-emerald-700">
                Future-Proofing
              </div>
              <div className="bg-white px-3 py-1 rounded-full text-emerald-700">Full Control</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    let interval: any;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Geometric Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-lg rotate-45 blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            LMS Strategy Presentation
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Custom-Built vs AI/Low-Code Tools - Strategic Decision Framework
          </p>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={prevSlide}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
              <span className="text-sm font-medium text-gray-700">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                isAutoPlay
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
              }`}
            >
              {isAutoPlay ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button
              onClick={nextSlide}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-8">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Main Presentation Area */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 min-h-[600px]"
            >
              {/* Slide Header */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                  {slides[currentSlide].icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="text-lg text-gray-600">{slides[currentSlide].subtitle}</p>
                </div>
              </div>

              {/* Slide Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {slides[currentSlide].content}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-gray-600 mb-4">
              Strategic recommendation based on 2025 market research and enterprise LMS analysis
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>Market Evidence</span>
              <span>•</span>
              <span>Proven Architecture</span>
              <span>•</span>
              <span>Hybrid Approach</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LMSStrategyPresentation;
