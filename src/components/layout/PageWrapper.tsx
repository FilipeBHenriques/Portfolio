import { motion } from 'framer-motion'
import { Navbar } from './Navbar'

interface PageWrapperProps {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ paddingTop: '56px', minHeight: '100vh' }}
      >
        {children}
      </motion.main>
    </>
  )
}
