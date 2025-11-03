"use client"
import { motion, type HTMLMotionProps } from 'framer-motion'
import React from 'react'

export function FadeIn({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function Pop({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}


