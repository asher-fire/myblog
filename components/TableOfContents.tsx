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
    <div
      className={clsx(
        'space-y-4 rounded-md border border-gray-200 p-4 px-3 dark:border-gray-700',
        className
      )}
    >
      <summary
        className="flex cursor-pointer items-center justify-between gap-4 marker:content-none"
        onClick={handleToggle}
      >
        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">目录导航</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={clsx(
            'h-5 w-5 transform text-gray-500 transition-transform duration-300 ease-in-out dark:text-gray-400',
            {
              'rotate-180': isOpen,
            }
          )}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </summary>
      <div
        className={clsx(
          'overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <ul
          className={clsx(
            'flex max-h-[70vh] flex-col space-y-2 overflow-y-auto',
            'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100',
            'dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800'
          )}
        >
          {toc.map(({ value, depth, url }) => (
            <li
              key={url}
              className={clsx('rounded-md px-2 py-1 transition-colors duration-200', {
                'bg-primary-500/10 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400':
                  activeId === url,
                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200':
                  activeId !== url,
              })}
              style={{ paddingLeft: `calc(${(depth - 2) * 12}px + 0.5rem)` }}
            >
              <Link href={url} className="block leading-normal">
                {value}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TableOfContents
