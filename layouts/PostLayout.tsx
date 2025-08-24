import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TableOfContents from '@/components/TableOfContents'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, toc, readingTime } = content
  const basePath = path.split('/')[0]

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-3 xl:pb-3">
            <div className="space-y-1 text-center">
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              <div className="flex flex-wrap items-center justify-center space-x-4 py-3 text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                {/* 作者信息 */}
                {authorDetails.map((author) => (
                  <div key={author.name} className="flex items-center gap-2">
                    {author.avatar && (
                      <Image
                        src={author.avatar}
                        width={20}
                        height={20}
                        alt="avatar"
                        className="h-5 w-5 rounded-full"
                      />
                    )}
                    <div>
                      <div>{author.name}</div>
                      {author.twitter && (
                        <Link
                          href={author.twitter}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          {author.twitter.replace('https://twitter.com/', '@')}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}

                {/* Divider */}
                <span className="hidden h-5 border-l border-gray-300 sm:inline-block dark:border-gray-600" />

                {/* 发布时间 */}
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd>
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </dl>

                {/* Divider */}
                <span className="hidden h-5 border-l border-gray-300 sm:inline-block dark:border-gray-600" />

                {/* 阅读时间 */}
                {readingTime?.minutes && <div>阅读时间：{Math.ceil(readingTime?.minutes)}分钟</div>}
              </div>

              {/* 标签list */}
              <div>
                {tags?.length > 0 && (
                  <dl>
                    <dt className="sr-only">Tags</dt>
                    <dd>
                      <div className="flex flex-wrap justify-center gap-2">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                    </dd>
                  </dl>
                )}
              </div>
            </div>
          </header>
          <div className="grid grid-cols-12 gap-x-6 pb-8 xl:divide-y xl:divide-gray-200 xl:pb-0 xl:dark:divide-gray-700">
            <div className="hidden xl:col-span-3 xl:block">
              {/* Table of Contents goes here on the left */}
              <TableOfContents toc={toc} className="sticky top-24" />
            </div>
            <div className="divide-y divide-gray-200 xl:col-span-9 xl:divide-y-0 dark:divide-gray-700">
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">{children}</div>
              {siteMetadata.comments && (
                <div
                  className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>
            <footer>
              <div className="pt-4 xl:pt-8">
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          上一篇
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div>
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          下一篇
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="Back to the list"
                >
                  &larr; 返回列表
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
