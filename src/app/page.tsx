"use client";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 overflow-hidden">
     
      

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20">
        {/* Left Text */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-1/2 space-y-6"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-blue-600 leading-tight">
            Build 3D Projects Like a Pro 
          </h2>
          <p className="text-gray-600 text-lg">
            Welcome to <span className="font-semibold text-blue-500">3D Builder</span> — a platform where creativity meets functionality.
            Build, visualize, and deploy interactive 3D experiences effortlessly.
          </p>
          <a href="/signup">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
            >
              Get Started
            </motion.button>
          </a>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="md:w-1/2 mt-10 md:mt-0"
        >
          <img
            src="models/3dmodelling-img.png"
            alt="3D Builder Illustration"
            className="w-full hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center mb-14 text-gray-800"
        >
          Why Choose <span className="text-blue-600">3D Builder</span>?
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-10 px-10 max-w-6xl mx-auto">
          {[
            {
              title: " Lightning Fast",
              desc: "Experience ultra-fast build times and optimized rendering for all your 3D projects.",
            },
            {
              title: " Beautiful & Interactive",
              desc: "Bring your designs to life with dynamic motion, realism, and fully responsive layouts.",
            },
            {
              title: " Easy to Customize",
              desc: "Easily adapt our templates to match your brand, workflow, or creative vision.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="p-8 bg-blue-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <h4 className="text-xl font-semibold mb-2 text-blue-600">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-6 text-center bg-gray-100 text-gray-600"
      >
        <p>
          © {new Date().getFullYear()} 3D Builder. Crafted with ❤️ by{" "}
          <span className="font-semibold text-blue-500">Abdul Malik Lawal</span>.
        </p>
      </motion.footer>
    </main>
  );
}
