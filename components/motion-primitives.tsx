"use client";

import {
  LazyMotion,
  domAnimation,
  m,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const softHover = {
  whileHover: { y: -4, scale: 1.01 },
  whileTap: { scale: 0.99 },
  transition: { type: "spring" as const, stiffness: 320, damping: 24 },
};

export function MotionRoot({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function PageMotion(props: HTMLMotionProps<"div">) {
  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      {...props}
    />
  );
}

export function ItemMotion(props: HTMLMotionProps<"div">) {
  return <m.div variants={itemVariants} {...props} />;
}

export { m };
