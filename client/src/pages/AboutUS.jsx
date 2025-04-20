import React from "react";
import { FaUsers, FaLightbulb, FaChartLine, FaHandshake } from "react-icons/fa";

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "CEO & Founder",
      image: "",
      bio: "Education technology expert with 10+ years of experience",
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Lead Instructor",
      image: "",
      bio: "Passionate educator specializing in online learning methodologies",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Tech Director",
      image: "",
      bio: "Software engineer focused on creating seamless learning experiences",
    },
  ];

  const stats = [
    {
      value: "10,000+",
      label: "Students Enrolled",
      icon: <FaUsers className="text-3xl" />,
    },
    {
      value: "500+",
      label: "Courses Offered",
      icon: <FaLightbulb className="text-3xl" />,
    },
    {
      value: "95%",
      label: "Satisfaction Rate",
      icon: <FaChartLine className="text-3xl" />,
    },
    {
      value: "50+",
      label: "Expert Instructors",
      icon: <FaHandshake className="text-3xl" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Our Learning Platform
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-center">
            Empowering learners worldwide through accessible, high-quality
            education
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-gray-600 text-lg leading-relaxed">
            Founded in 2018, we started with a simple mission: to make quality
            education accessible to everyone. What began as a small team of
            educators and technologists has grown into a global platform serving
            thousands of learners across 50+ countries. We believe that learning
            should be engaging, flexible, and tailored to individual needs.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 mb-2">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                To break down barriers to education by providing affordable,
                high-quality learning opportunities to anyone, anywhere.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">
                    Personalized learning paths
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">World-class instructors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Cutting-edge curriculum</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 bg-gray-100 h-80 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">
                Mission illustration or video
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to start your learning journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already advancing their careers
            with our courses.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg">
            Explore Courses
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
