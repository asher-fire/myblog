'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'

import Link from '@/components/Link'

type TocItem = {
  value: string
  url: string
  depth: number
}

interface TableOfContentsProps {
  toc: TocItem[]
  className?: string
}

const TableOfContents = (props: TableOfContentsProps) => {
  const { toc, className } = props
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(`#${entry.target.id}`)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '0px 0px -80% 0px',
      threshold: 0.1,
    })

    toc.forEach(({ url }) => {
      const element = document.querySelector(url)

      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      toc.forEach(({ url }) => {
        const element = document.querySelector(url)

        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [toc])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={clsx('space-y-4', className)}>
      <summary
        className="flex cursor-pointer items-center gap-4 marker:content-none"
        onClick={handleToggle}
      >
        <span className="text-lg font-medium">目录导航</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={clsx('h-5 w-5 transform transition-transform', {
            'rotate-180': isOpen,
          })}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </summary>
      {isOpen && (
        <ul className="flex flex-col space-y-2">
          {toc.map(({ value, depth, url }) => (
            <li
              key={url}
              className={clsx('text-gray-500 dark:text-gray-400', {
                'text-primary-500 dark:text-primary-600': activeId === url,
              })}
              style={{ paddingLeft: (depth - 2) * 16 }}
            >
              <Link href={url}>{value}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TableOfContents
