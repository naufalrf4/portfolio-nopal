'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

const GEOMETRIC_SHAPES = [
  { size: 60, top: '10%', left: '5%', delay: 0 },
  { size: 80, top: '60%', right: '8%', delay: 0.2 },
  { size: 50, bottom: '15%', left: '10%', delay: 0.4 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as any,
    },
  },
};

const shapeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (custom: number) => ({
    opacity: 0.6,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: custom,
      ease: [0.4, 0, 0.2, 1] as any,
    },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
      {GEOMETRIC_SHAPES.map((shape, index) => (
        <motion.div
          key={index}
          custom={shape.delay}
          variants={shapeVariants}
          initial="hidden"
          className="absolute neu-extruded rounded-[32px] pointer-events-none"
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
            right: shape.right,
            bottom: shape.bottom,
          }}
          animate={{
            opacity: 0.6,
            scale: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: shape.delay },
            scale: { duration: 0.8, delay: shape.delay },
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: shape.delay },
          }}
        />
      ))}

      <motion.div
        className="max-w-4xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-block neu-inset px-6 py-2 rounded-full mb-6"
        >
          <span className="text-sm font-medium text-primary">Welcome to my portfolio</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6"
        >
          Full-Stack Engineer
          <br />
          <span className="text-primary">specializing in</span>
          <br />
          scalable web applications
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          Building modern, performant, and user-centric applications with cutting-edge technologies
          and best practices.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/projects"
            className="group neu-card px-8 py-4 text-foreground font-medium inline-flex items-center gap-2 hover:neu-extruded-hover"
          >
            View Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/contact"
            className="neu-inset px-8 py-4 text-foreground font-medium inline-flex items-center gap-2 hover:neu-inset-deep transition-all"
          >
            <Mail className="w-5 h-5" />
            Contact Me
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
        >
          <span>Tech Stack:</span>
          {['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'].map((tech) => (
            <span key={tech} className="neu-inset px-4 py-2 rounded-full">
              {tech}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-muted-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
