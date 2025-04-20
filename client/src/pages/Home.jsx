import React from "react";
import Card from "../components/Card";
import hero from "../assets/Images/hero.jpg";
import { Link } from "react-router-dom";
import dp from "../assets/Images/dp.jpg";
import {
  FaBook,
  FaChalkboardTeacher,
  FaCertificate,
  FaComments,
  FaQuoteLeft,
  FaUsers,
  FaGraduationCap,
  FaChartLine,
} from "react-icons/fa";
import { useGetCoursesQuery } from "../redux/api/courseApi";

// Theme Constants
const theme = {
  colors: {
    primary: "bg-indigo-600",
    primaryDark: "bg-indigo-700",
    primaryLight: "bg-indigo-100",
    secondary: "bg-teal-500",
    accent: "bg-amber-400",
    light: "bg-gray-50",
    dark: "bg-gray-800",
  },
  text: {
    primary: "text-indigo-600",
    primaryDark: "text-indigo-700",
    light: "text-gray-50",
    dark: "text-gray-800",
    muted: "text-gray-600",
  },
  buttons: {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-teal-500 hover:bg-teal-600 text-white",
    accent: "bg-amber-400 hover:bg-amber-500 text-gray-800",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
  },
};

// Testimonial data with theme colors
const testimonials = [
  {
    quote:
      "This platform transformed my learning experience with its intuitive interface and quality content.",
    name: "Alex Johnson",
    role: "Frontend Developer",
    avatar: dp,
    bgColor: "bg-indigo-50",
  },
  {
    quote:
      "The structured courses helped me transition careers. Incredible value!",
    name: "Maria Garcia",
    role: "Data Scientist",
    avatar: dp,
    bgColor: "bg-teal-50",
  },
  {
    quote:
      "As a visual learner, the interactive exercises were exactly what I needed to grasp complex concepts.",
    name: "James Wilson",
    role: "UX Designer",
    avatar: dp,
    bgColor: "bg-amber-50",
  },
];

const statistics = [
  {
    icon: <FaUsers className="w-12 h-12 mx-auto mb-4 text-indigo-600" />,
    value: "50,000+",
    label: "Enrolled Learners",
    trend: "+12% this month",
  },
  {
    icon: <FaBook className="w-12 h-12 mx-auto mb-4 text-teal-500" />,
    value: "500+",
    label: "Courses Offered",
    trend: "15 new this quarter",
  },
  {
    icon: <FaGraduationCap className="w-12 h-12 mx-auto mb-4 text-amber-400" />,
    value: "10,000+",
    label: "Certifications Awarded",
    trend: "92% completion rate",
  },
  {
    icon: <FaChartLine className="w-12 h-12 mx-auto mb-4 text-indigo-600" />,
    value: "95%",
    label: "Satisfaction Rate",
    trend: "Industry leading",
  },
];

const features = [
  {
    icon: <FaBook className="w-16 h-16 mx-auto mb-4 text-indigo-600" />,
    title: "Flexible Learning",
    description: "Learn at your own pace with 24/7 access to all materials.",
    bgColor: "bg-indigo-50",
  },
  {
    icon: (
      <FaChalkboardTeacher className="w-16 h-16 mx-auto mb-4 text-teal-500" />
    ),
    title: "Expert Instructors",
    description: "Learn from industry leaders with real-world experience.",
    bgColor: "bg-teal-50",
  },
  {
    icon: <FaCertificate className="w-16 h-16 mx-auto mb-4 text-amber-400" />,
    title: "Career Certificates",
    description: "Earn credentials recognized by top employers.",
    bgColor: "bg-amber-50",
  },
  {
    icon: <FaComments className="w-16 h-16 mx-auto mb-4 text-indigo-600" />,
    title: "Community Learning",
    description: "Collaborate with peers in discussion forums.",
    bgColor: "bg-indigo-50",
  },
];

const Home = () => {
  const { data: courses, isLoading, isError } = useGetCoursesQuery();

  return (
    <div className="min-h-[calc(100vh-64px)] w-full overflow-x-hidden bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-800/90 to-indigo-600/90">
          <div className="container mx-auto h-full flex items-center px-4">
            <div className="text-center max-w-2xl mx-auto text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Unlock Your <span className="text-amber-300">Potential</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Join our community of learners and master in-demand skills with
                project-based courses and expert mentorship.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/course"
                  className={`${theme.buttons.primary} px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl`}
                >
                  Browse Courses
                </Link>
                <Link
                  to="/signin"
                  className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors hover:bg-gray-100 shadow-lg"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
        <img
          src={hero}
          alt="Diverse students collaborating on laptops"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </section>

      {/* Key Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-sm font-semibold text-teal-600 bg-teal-100 rounded-full mb-3">
            Why Learn With Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Education That <span className="text-indigo-600">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our proven approach combines the best of online learning with
            hands-on practice.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <StatsSection statistics={statistics} />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* CTA Section */}
      <CTASection />

      {/* Courses Section */}
      <CoursesSection
        courses={courses}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, bgColor }) => (
  <div
    className={`${bgColor} p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col`}
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 mt-auto">{description}</p>
  </div>
);

// Stats Section Component
const StatsSection = ({ statistics }) => (
  <section className="bg-indigo-600 py-16">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Our Learning Community
        </h2>
        <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
          Join thousands who have transformed their careers
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statistics.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
          >
            <div className="mb-4">{stat.icon}</div>
            <p className="text-3xl font-bold mb-2 text-gray-900">
              {stat.value}
            </p>
            <p className="text-gray-700 font-medium">{stat.label}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Testimonials Section Component
const TestimonialsSection = ({ testimonials }) => (
  <section className="container mx-auto px-4 py-16">
    <div className="text-center mb-12">
      <span className="inline-block px-3 py-1 text-sm font-semibold text-amber-600 bg-amber-100 rounded-full mb-3">
        Success Stories
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        What Our <span className="text-indigo-600">Learners</span> Say
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Don't just take our word for it - hear from our community
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <TestimonialCard key={index} {...testimonial} />
      ))}
    </div>
  </section>
);

// Testimonial Card Component
const TestimonialCard = ({ quote, name, role, avatar, bgColor }) => (
  <div
    className={`${bgColor} p-6 rounded-xl shadow-md hover:shadow-lg transition-all h-full flex flex-col`}
  >
    <FaQuoteLeft className="w-8 h-8 mb-4 text-indigo-600 opacity-50" />
    <blockquote className="text-gray-700 mb-6 flex-grow">"{quote}"</blockquote>
    <div className="flex items-center mt-auto">
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-white shadow-sm"
        loading="lazy"
      />
      <div>
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  </div>
);

// CTA Section Component
const CTASection = () => (
  <section className="bg-gradient-to-r from-indigo-700 to-indigo-800 py-16">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Ready to Transform Your Career?
      </h2>
      <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
        Join thousands of learners who've accelerated their careers with our
        courses
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/signin"
          className="bg-amber-400 hover:bg-amber-500 text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Get Started Now
        </Link>
        <Link
          to="/course"
          className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors"
        >
          Browse All Courses
        </Link>
      </div>
    </div>
  </section>
);

// Courses Section Component
const CoursesSection = ({ courses, isLoading, isError }) => {
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="bg-gray-200 h-48 w-full"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !courses) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Course Loading Error
          </h2>
          <p className="text-gray-600 mb-6">
            We're having trouble loading our courses. Please check your
            connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-3">
          Featured Content
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Popular <span className="text-indigo-600">Courses</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Start learning with our most popular courses
        </p>
      </div>

      {courses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.slice(0, 4).map((course) => (
              <Card key={course._id} course={course} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/course"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl inline-flex items-center"
            >
              View All Courses
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-2xl mx-auto">
          <p className="text-gray-600 mb-4">
            We're currently updating our course catalog. Please check back soon!
          </p>
          <Link
            to="/contact"
            className="border-2 border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg font-medium inline-block hover:bg-indigo-50"
          >
            Notify Me
          </Link>
        </div>
      )}
    </section>
  );
};

export default Home;
