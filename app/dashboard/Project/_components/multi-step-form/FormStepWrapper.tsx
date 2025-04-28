"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface FormStepWrapperProps {
  children: ReactNode;
  step: number;
  currentStep: number;
}

const FormStepWrapper = ({ children, step, currentStep }: FormStepWrapperProps) => {
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <AnimatePresence mode="wait" custom={currentStep}>
      {step === currentStep && (
        <motion.div
          key={step}
          custom={currentStep}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormStepWrapper; 