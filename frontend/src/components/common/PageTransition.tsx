import type { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

/**
 * Soft fade + rise for route content. Keyed by the router on pathname so
 * every navigation replays the entrance.
 */
export function PageTransition({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  );
}
