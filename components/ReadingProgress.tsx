'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  // Reading progress bar logic
  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector('article')
      if (!article) return

      const { top, height } = article.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const scrollableHeight = height - windowHeight
      const scrollPosition = Math.max(0, -top)
      const progressPercent = Math.min((scrollPosition / scrollableHeight) * 100, 100)
      setProgress(progressPercent)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 z-50 h-1 w-full">
      <div
        className="bg-primary-500 h-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
