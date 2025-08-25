'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrollTop = window.scrollY
      const progress = (scrollTop / totalHeight) * 100
      setProgress(progress)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 z-50 h-1 w-full">
      <div
        className="bg-primary-500 h-1 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
