'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { clsx } from 'clsx'

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4 text-amber-500 drop-shadow-[0_1px_2px_rgba(251,191,36,0.4)] transition-colors duration-300"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
)

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4 text-gray-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
    aria-hidden="true"
  >
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  const isLight = mounted && resolvedTheme === 'light'
  const isDark = mounted && resolvedTheme === 'dark'

  const handleToggle = () => {
    if (isLight) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  // The 'system' theme is not directly toggled.
  // We can add a separate button for 'system' if needed, or
  // just assume a two-state toggle between light and dark.
  // For this implementation, we'll only toggle between light and dark.
  // The user can still set 'system' manually from their OS settings.
  // A more advanced solution would involve a popup for all three options.

  // We are recreating the toggle's look with Tailwind CSS classes.
  // The `relative` and `peer` classes are crucial for the styling.

  if (!mounted) {
    return null // Return nothing until the component is mounted on the client side.
  }

  return (
    <div className="flex items-center justify-center sm:justify-end lg:justify-center">
      <label
        className="relative inline-block h-8 w-14 cursor-pointer transition-transform duration-300 will-change-transform hover:scale-105 active:scale-95"
        aria-label="Toggle theme mode"
      >
        <input
          className="peer absolute opacity-0"
          aria-checked={isDark}
          type="checkbox"
          checked={isDark}
          onChange={handleToggle}
        />
        {/* The switch track */}
        <div
          className={clsx(
            'absolute inset-0 overflow-hidden rounded-full transition-colors duration-300',
            'bg-gradient-to-br from-gray-50 via-gray-200 to-gray-300 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2),inset_0_-2px_5px_rgba(255,255,255,0.5)]',
            'dark:from-gray-600 dark:via-gray-700 dark:to-gray-900 dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.4),inset_0_-2px_5px_rgba(255,255,255,0.1)]',
            {
              'peer-checked:from-gray-500 peer-checked:via-gray-600 peer-checked:to-gray-800 peer-checked:shadow-[inset_0_2px_8px_rgba(0,0,0,0.4),inset_0_-2px_5px_rgba(255,255,255,0.1)]':
                isLight, // Transition to dark style when peer-checked (i.e., isDark is true)
            }
          )}
        >
          {/* Subtle light effect on the track */}
          <div
            className={clsx(
              'absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transition-opacity duration-300',
              { 'opacity-0 peer-checked:opacity-30': isLight, 'opacity-30': isDark }
            )}
          ></div>
        </div>

        {/* The switch thumb with icon */}
        <div
          className={clsx(
            'group absolute top-[2px] flex h-7 w-7 transform items-center justify-center rounded-full transition-transform duration-300',
            'bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1),0_-1px_2px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)]',
            'dark:bg-gradient-to-br dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.2),0_-1px_2px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.2)]',
            {
              'translate-x-[24px]': isDark, // Move to the right for dark mode
              'translate-x-[2px]': isLight, // Stay on the left for light mode
            }
          )}
          tabIndex={-1} // Make it not focusable as the label handles the click
        >
          <div
            className="relative z-10 transition-transform duration-300"
            style={{ transform: isDark ? 'scale(1.04311)' : 'scale(1)' }}
          >
            <div
              className="relative transition-transform duration-300"
              style={{
                transform: isDark ? 'scale(1) rotate(0deg)' : 'scale(1.03886) rotate(264.114deg)',
              }}
            >
              <div
                className={clsx('transition-opacity duration-300', {
                  'opacity-100': isLight,
                  'opacity-0': isDark,
                })}
              >
                <SunIcon />
              </div>
              <div
                className={clsx('absolute inset-0 transition-opacity duration-300', {
                  'opacity-0': isLight,
                  'opacity-100': isDark,
                })}
              >
                <MoonIcon />
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>
  )
}

export default ThemeSwitch
