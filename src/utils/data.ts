const data = [
  {
    title: 'Advanced Data Analysis',
    level: 'Advanced',
    category: 'Data Science',
    assessment_required: 'Yes',
    duration: 10,
    language: 'English',
    training_status: 'Ongoing',
    description: 'This course delves deep into advanced techniques for analyzing complex datasets.',
    owner_by: 'XYZ Training Institute',
    endorsed_by: 'DEF University',
    assessment: 'Final project',
    price: 149,
    currency: 'USD',
    training_metadata: {
      heading: 'Course Overview',
      body: 'This course covers advanced methodologies for data analysis and interpretation.',
      overview: 'Explore cutting-edge techniques in data analysis.',
      preview_video: 'https://example.com/preview_video_advanced.mp4',
      preview_image: 'https://example.com/preview_image_advanced.jpg',
      objectives: [
        { title: 'Master advanced data analysis techniques' },
        { title: 'Apply advanced statistical methods' },
      ],
      prerequisites: [
        { title: 'Proficiency in Python programming' },
        { title: 'Strong understanding of statistics' },
      ],
      audience: [{ title: 'Data analysts' }, { title: 'Data scientists' }],
      skills_covered: [{ title: 'Advanced statistical analysis' }, { title: 'Data visualization' }],
      key_features: [{ title: 'Hands-on projects' }, { title: 'Case studies from industry' }],
      benefits: [
        { title: 'Develop expertise in complex data analysis' },
        { title: 'Advance your career in data science' },
      ],
      resources: [{ title: 'Online lectures' }, { title: 'Research papers' }],
      outcomes: [{ title: 'Ability to tackle complex data analysis tasks' }],
      certification_text: 'Certificate of completion',
      certification_image: 'https://example.com/certification_image_advanced.jpg',
      FAQs: [
        {
          question: 'Is this course suitable for beginners?',
          answer: 'No, this course requires prior experience in data analysis.',
        },
      ],
      curriculum: [
        {
          title: 'Exploratory Data Analysis',
          videoSection: 'Module - 1',
          section_parts: [{ title: 'Data Cleaning' }, { title: 'Data Visualization' }],
        },
        {
          title: 'Advanced Statistical Methods',
          videoSection: 'Module - 2',
          section_parts: [{ title: 'Regression Analysis' }, { title: 'Multivariate Analysis' }],
        },
      ],
    },
    training_batches: [
      {
        batch: '2024B02',
        batch_name: 'Batch 02',
        isPaid: true,
        trainer: 'Jane Smith',
        start_date: '2024-05-01T09:00:00Z',
        enrollment_date: '2024-04-15T00:00:00Z',
        end_date: '2024-07-10T17:00:00Z',
        capacity: 40,
        batch_status: 'Active',
      },
    ],
    batch_sessions: [
      {
        batch: '2024B02',
        batch_sections: [
          {
            name: 'Data Cleaning',
            start_time: '2024-05-01T09:00:00Z',
            end_time: '2024-05-01T11:00:00Z',
          },
          {
            name: 'Regression Analysis',
            start_time: '2024-05-08T09:00:00Z',
            end_time: '2024-05-08T11:00:00Z',
          },
        ],
      },
    ],
  },
  {
    title: 'Python Programming Basics',
    level: 'Beginner',
    category: 'Programming',
    assessment_required: 'No',
    duration: 6,
    language: 'English',
    training_status: 'Upcoming',
    description: 'This course introduces the basics of Python programming language.',
    owner_by: 'ABC Coding Academy',
    endorsed_by: 'GHI University',
    assessment: '',
    price: 79,
    currency: 'USD',
    training_metadata: {
      heading: 'Course Overview',
      body: 'This course covers the fundamental concepts of Python programming.',
      overview: 'Learn the basics of Python programming language.',
      preview_video: 'https://example.com/python_preview.mp4',
      preview_image: 'https://example.com/python_preview_image.jpg',
      objectives: [
        { title: 'Understand basic Python syntax' },
        { title: 'Write simple Python programs' },
      ],
      prerequisites: [{ title: 'No prior programming experience required' }],
      audience: [{ title: 'Beginners interested in programming' }],
      skills_covered: [{ title: 'Python syntax' }, { title: 'Basic programming logic' }],
      key_features: [{ title: 'Interactive coding exercises' }, { title: 'Quizzes' }],
      benefits: [
        { title: 'Gain a strong foundation in Python programming' },
        { title: 'Start your journey into software development' },
      ],
      resources: [{ title: 'Video lectures' }, { title: 'Online coding platforms' }],
      outcomes: [{ title: 'Ability to write simple Python programs' }],
      certification_text: 'Certificate of completion',
      certification_image: 'https://example.com/python_certification.jpg',
      FAQs: [
        {
          question: 'Is this course suitable for experienced programmers?',
          answer: 'No, this course is designed for beginners.',
        },
      ],
      curriculum: [
        {
          title: 'Introduction to Python',
          videoSection: 'Module - 1',
          section_parts: [{ title: 'Python Basics' }, { title: 'Data Types' }],
        },
        {
          title: 'Control Structures',
          videoSection: 'Module - 2',
          section_parts: [{ title: 'Conditional Statements' }, { title: 'Loops' }],
        },
      ],
    },
    training_batches: [
      {
        batch: '2024B03',
        batch_name: 'Batch 03',
        isPaid: true,
        trainer: 'Alice Johnson',
        start_date: '2024-05-10T10:00:00Z',
        enrollment_date: '2024-04-20T00:00:00Z',
        end_date: '2024-06-21T17:00:00Z',
        capacity: 30,
        batch_status: 'Upcoming',
      },
    ],
    batch_sessions: [
      {
        batch: '2024B03',
        batch_sections: [
          {
            name: 'Python Basics',
            start_time: '2024-05-10T10:00:00Z',
            end_time: '2024-05-10T12:00:00Z',
          },
          {
            name: 'Conditional Statements',
            start_time: '2024-05-17T10:00:00Z',
            end_time: '2024-05-17T12:00:00Z',
          },
        ],
      },
    ],
  },
  {
    title: 'Introduction to Neural Networks',
    level: 'Intermediate',
    category: 'Machine Learning',
    assessment_required: 'Yes',
    duration: 8,
    language: 'English',
    training_status: 'Completed',
    description:
      'This course provides a basic understanding of neural networks and their applications.',
    owner_by: 'XYZ AI Academy',
    endorsed_by: 'JKL University',
    assessment: 'Final project',
    price: 129,
    currency: 'USD',
    training_metadata: {
      heading: 'Course Overview',
      body: 'This course covers the fundamentals of neural networks and deep learning.',
      overview: 'Learn the basics of neural networks and their applications.',
      preview_video: 'https://example.com/neural_networks_preview.mp4',
      preview_image: 'https://example.com/neural_networks_preview_image.jpg',
      objectives: [
        { title: 'Understand basic concepts of neural networks' },
        { title: 'Implement simple neural network models' },
      ],
      prerequisites: [
        { title: 'Basic knowledge of Python programming' },
        { title: 'Understanding of linear algebra' },
      ],
      audience: [{ title: 'Data scientists' }, { title: 'Machine learning enthusiasts' }],
      skills_covered: [
        { title: 'Neural network architecture' },
        { title: 'Deep learning frameworks' },
      ],
      key_features: [{ title: 'Hands-on coding exercises' }, { title: 'Projects' }],
      benefits: [
        { title: 'Gain insights into neural network fundamentals' },
        { title: 'Apply neural networks in real-world scenarios' },
      ],
      resources: [{ title: 'Video lectures' }, { title: 'Code repositories' }],
      outcomes: [{ title: 'Ability to build basic neural network models' }],
      certification_text: 'Certificate of completion',
      certification_image: 'https://example.com/neural_networks_certificate.jpg',
      FAQs: [
        {
          question: 'Is this course suitable for beginners?',
          answer: 'Yes, beginners with basic Python knowledge can take this course.',
        },
      ],
      curriculum: [
        {
          title: 'Introduction to Neural Networks',
          videoSection: 'Module - 1',
          section_parts: [
            { title: 'Neurons and Activation Functions' },
            { title: 'Feedforward Neural Networks' },
          ],
        },
        {
          title: 'Deep Learning',
          videoSection: 'Module - 2',
          section_parts: [
            { title: 'Convolutional Neural Networks' },
            { title: 'Recurrent Neural Networks' },
          ],
        },
      ],
    },
    training_batches: [
      {
        batch: '2024B04',
        batch_name: 'Batch 04',
        isPaid: true,
        trainer: 'Mark Brown',
        start_date: '2024-04-01T10:00:00Z',
        enrollment_date: '2024-03-15T00:00:00Z',
        end_date: '2024-05-20T17:00:00Z',
        capacity: 35,
        batch_status: 'Completed',
      },
    ],
    batch_sessions: [
      {
        batch: '2024B04',
        batch_sections: [
          {
            name: 'Neurons and Activation Functions',
            start_time: '2024-04-01T10:00:00Z',
            end_time: '2024-04-01T12:00:00Z',
          },
          {
            name: 'Convolutional Neural Networks',
            start_time: '2024-04-08T10:00:00Z',
            end_time: '2024-04-08T12:00:00Z',
          },
        ],
      },
    ],
  },
  {
    title: 'Web Development Bootcamp',
    level: 'Beginner',
    category: 'Web Development',
    assessment_required: 'Yes',
    duration: 12,
    language: 'English',
    training_status: 'Upcoming',
    description:
      'This bootcamp covers the essentials of web development, including HTML, CSS, and JavaScript.',
    owner_by: 'XYZ Coding School',
    endorsed_by: 'MNO University',
    assessment: 'Capstone project',
    price: 199,
    currency: 'USD',
    training_metadata: {
      heading: 'Course Overview',
      body: 'This bootcamp provides a comprehensive introduction to web development.',
      overview: 'Master the basics of web development and build your own projects.',
      preview_video: 'https://example.com/webdev_preview.mp4',
      preview_image: 'https://example.com/webdev_preview_image.jpg',
      objectives: [
        { title: 'Learn HTML, CSS, and JavaScript' },
        { title: 'Build responsive web applications' },
      ],
      prerequisites: [{ title: 'No prior coding experience required' }],
      audience: [{ title: 'Beginners interested in web development' }],
      skills_covered: [{ title: 'HTML' }, { title: 'CSS' }, { title: 'JavaScript' }],
      key_features: [{ title: 'Hands-on projects' }, { title: 'Live coding sessions' }],
      benefits: [
        { title: 'Develop skills to create dynamic websites' },
        { title: 'Start a career in web development' },
      ],
      resources: [{ title: 'Video tutorials' }, { title: 'Code editors' }],
      outcomes: [{ title: 'Ability to create responsive web applications' }],
      certification_text: 'Certificate of completion',
      certification_image: 'https://example.com/webdev_certificate.jpg',
      FAQs: [
        {
          question: 'Is this bootcamp suitable for experienced developers?',
          answer: 'No, this bootcamp is designed for beginners.',
        },
      ],
      curriculum: [
        {
          title: 'Introduction to HTML',
          videoSection: 'Module - 1',
          section_parts: [{ title: 'HTML Basics' }, { title: 'HTML Elements' }],
        },
        {
          title: 'Styling with CSS',
          videoSection: 'Module - 2',
          section_parts: [{ title: 'CSS Selectors' }, { title: 'CSS Box Model' }],
        },
      ],
    },
    training_batches: [
      {
        batch: '2024B05',
        batch_name: 'Batch 05',
        isPaid: true,
        trainer: 'David Wilson',
        start_date: '2024-06-01T09:00:00Z',
        enrollment_date: '2024-05-15T00:00:00Z',
        end_date: '2024-08-31T17:00:00Z',
        capacity: 25,
        batch_status: 'Upcoming',
      },
    ],
    batch_sessions: [
      {
        batch: '2024B05',
        batch_sections: [
          {
            name: 'HTML Basics',
            start_time: '2024-06-01T09:00:00Z',
            end_time: '2024-06-01T11:00:00Z',
          },
          {
            name: 'CSS Selectors',
            start_time: '2024-06-08T09:00:00Z',
            end_time: '2024-06-08T11:00:00Z',
          },
        ],
      },
    ],
  },
  {
    title: 'Data Visualization Fundamentals',
    level: 'Intermediate',
    category: 'Data Science',
    assessment_required: 'No',
    duration: 6,
    language: 'English',
    training_status: 'Completed',
    description:
      'This course covers the principles and techniques of effective data visualization.',
    owner_by: 'ABC Data Academy',
    endorsed_by: 'PQR University',
    assessment: '',
    price: 89,
    currency: 'USD',
    training_metadata: {
      heading: 'Course Overview',
      body: 'This course teaches the fundamentals of data visualization using popular tools and libraries.',
      overview: 'Master the art of presenting data visually for better understanding.',
      preview_video: 'https://example.com/dataviz_preview.mp4',
      preview_image: 'https://example.com/dataviz_preview_image.jpg',
      objectives: [
        { title: 'Learn principles of effective data visualization' },
        { title: 'Use data visualization tools like Matplotlib and Seaborn' },
      ],
      prerequisites: [{ title: 'Basic understanding of Python programming' }],
      audience: [{ title: 'Data analysts' }, { title: 'Data scientists' }],
      skills_covered: [
        { title: 'Data visualization techniques' },
        { title: 'Plotting with Python libraries' },
      ],
      key_features: [{ title: 'Interactive visualizations' }, { title: 'Case studies' }],
      benefits: [
        { title: 'Improve communication of data insights' },
        { title: 'Enhance data analysis skills' },
      ],
      resources: [{ title: 'Video lectures' }, { title: 'Code repositories' }],
      outcomes: [{ title: 'Ability to create compelling data visualizations' }],
      certification_text: 'Certificate of completion',
      certification_image: 'https://example.com/dataviz_certificate.jpg',
      FAQs: [
        {
          question: 'Is this course suitable for beginners?',
          answer: 'Yes, beginners with basic Python knowledge can take this course.',
        },
      ],
      curriculum: [
        {
          title: 'Introduction to Data Visualization',
          videoSection: 'Module - 1',
          section_parts: [
            { title: 'Importance of Data Visualization' },
            { title: 'Types of Charts' },
          ],
        },
        {
          title: 'Data Visualization with Python',
          videoSection: 'Module - 2',
          section_parts: [{ title: 'Matplotlib Basics' }, { title: 'Seaborn Introduction' }],
        },
      ],
    },
    training_batches: [
      {
        batch: '2024B06',
        batch_name: 'Batch 06',
        isPaid: true,
        trainer: 'Sophia Lee',
        start_date: '2024-03-15T10:00:00Z',
        enrollment_date: '2024-03-01T00:00:00Z',
        end_date: '2024-04-30T17:00:00Z',
        capacity: 20,
        batch_status: 'Completed',
      },
    ],
    batch_sessions: [
      {
        batch: '2024B06',
        batch_sections: [
          {
            name: 'Importance of Data Visualization',
            start_time: '2024-03-15T10:00:00Z',
            end_time: '2024-03-15T12:00:00Z',
          },
          {
            name: 'Matplotlib Basics',
            start_time: '2024-03-22T10:00:00Z',
            end_time: '2024-03-22T12:00:00Z',
          },
        ],
      },
    ],
  },
  {
    title: 'Natural Language Processing',
    level: 'Advanced',
    category: 'Machine Learning',
    assessment_required: 'Yes',
    duration: 10,
    language: 'English',
    training_status: 'Upcoming',
    description:
      'This course explores advanced techniques for processing and analyzing natural language.',
    owner_by: 'XYZ AI Institute',
    endorsed_by: 'STU University',
    assessment: 'Final project',
    price: 159,
    currency: 'USD',
    training_metadata: {
      heading: 'Course Overview',
      body: 'This course covers advanced topics in natural language processing (NLP) and text analytics.',
      overview: 'Dive deep into the field of natural language processing and text analysis.',
      preview_video: 'https://example.com/nlp_preview.mp4',
      preview_image: 'https://example.com/nlp_preview_image.jpg',
      objectives: [
        { title: 'Explore advanced NLP techniques' },
        { title: 'Apply NLP algorithms to real-world text data' },
      ],
      prerequisites: [
        { title: 'Strong foundation in Python programming' },
        { title: 'Understanding of machine learning concepts' },
      ],
      audience: [{ title: 'Data scientists' }, { title: 'NLP researchers' }],
      skills_covered: [
        { title: 'Text preprocessing' },
        { title: 'Sentiment analysis' },
        { title: 'Named entity recognition' },
      ],
      key_features: [{ title: 'Hands-on projects' }, { title: 'Research paper discussions' }],
      benefits: [
        { title: 'Master advanced NLP techniques' },
        { title: 'Contribute to cutting-edge research in NLP' },
      ],
      resources: [{ title: 'Video lectures' }, { title: 'Research papers' }],
      outcomes: [{ title: 'Ability to implement advanced NLP algorithms' }],
      certification_text: 'Certificate of completion',
      certification_image: 'https://example.com/nlp_certificate.jpg',
      FAQs: [
        {
          question: 'Is this course suitable for beginners?',
          answer: 'No, this course requires prior knowledge of Python and machine learning.',
        },
      ],
      curriculum: [
        {
          title: 'Text Preprocessing',
          videoSection: 'Module - 1',
          section_parts: [{ title: 'Tokenization' }, { title: 'Stopword Removal' }],
        },
        {
          title: 'Advanced NLP Techniques',
          videoSection: 'Module - 2',
          section_parts: [{ title: 'Topic Modeling' }, { title: 'Sequence-to-Sequence Models' }],
        },
      ],
    },
    training_batches: [
      {
        batch: '2024B07',
        batch_name: 'Batch 07',
        isPaid: true,
        trainer: 'Emily Brown',
        start_date: '2024-07-01T09:00:00Z',
        enrollment_date: '2024-06-15T00:00:00Z',
        end_date: '2024-09-10T17:00:00Z',
        capacity: 25,
        batch_status: 'Upcoming',
      },
    ],
    batch_sessions: [
      {
        batch: '2024B07',
        batch_sections: [
          {
            name: 'Tokenization',
            start_time: '2024-07-01T09:00:00Z',
            end_time: '2024-07-01T11:00:00Z',
          },
          {
            name: 'Topic Modeling',
            start_time: '2024-07-08T09:00:00Z',
            end_time: '2024-07-08T11:00:00Z',
          },
        ],
      },
    ],
  },
];

export default data;
