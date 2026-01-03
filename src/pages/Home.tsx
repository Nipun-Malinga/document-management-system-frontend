import Navbar from '@/components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield, Users } from 'lucide-react';
import { Button } from '@/components';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'Fast Document Access',
      description:
        'Upload, organize, and retrieve documents instantly with optimized indexing',
    },
    {
      icon: Shield,
      title: 'Secure Access Control',
      description:
        'Role-based permissions, encryption, and audit logs to protect sensitive files',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description:
        'Share folders, manage versions, and collaborate without duplication or conflicts',
    },
  ];

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      <Navbar />

      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32'>
        <div className='text-center max-w-4xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-full mb-8'>
            <span className='text-sm font-semibold text-blue-600 dark:text-blue-400'>
              🚀 Secure document management for growing teams
            </span>
          </div>

          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight'>
            Centralized Document
            <span className='block text-blue-600 dark:text-blue-400'>
              Management System
            </span>
          </h1>

          <p className='text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto'>
            Store, organize, and secure your documents with fine-grained access
            control, version history, and team collaboration.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Button
              onClick={() => navigate('/auth/registration')}
              className='w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white hover:text-gray-300 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95'
            >
              Create Your Workspace
              <ArrowRight className='w-5 h-5' />
            </Button>
            <Button
              onClick={() => navigate('/auth/signin')}
              className='w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 active:scale-95'
            >
              Access Your Documents
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className='flex items-center justify-center gap-6 mt-12 text-sm text-gray-600 dark:text-gray-400'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
              <span>No credit card required</span>
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
              <span>Free 14-day trial</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-gray-50 dark:bg-gray-800 py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              Built for Document Control
            </h2>
            <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              Everything you need to manage documents securely and efficiently
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='bg-white dark:bg-gray-900 p-8 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg'
              >
                <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-fit mb-4'>
                  <feature.icon className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='bg-blue-600 dark:bg-blue-700 rounded-2xl p-12 shadow-2xl'>
            <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
              Take control of your documents
            </h2>
            <p className='text-lg text-blue-100 mb-8 max-w-2xl mx-auto'>
              Stop losing files, enforce permissions, and keep a complete
              history of every change
            </p>

            <Button
              onClick={() => navigate('/auth/registration')}
              className='inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-blue-600 bg-white hover:bg-gray-50 hover:text-blue-500 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95'
            >
              Start Managing Documents
              <ArrowRight className='w-5 h-5' />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
