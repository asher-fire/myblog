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
import ReadingProgress from '@/components/ReadingProgress'

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
      {/* Reading progress bar */}
      <ReadingProgress />
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-3">
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
              {tags?.length > 0 && (
                <dl className="flex justify-center">
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
          </header>
          <div className="grid grid-cols-1 gap-y-6 pt-6 xl:grid-cols-12 xl:gap-x-6 xl:divide-y xl:divide-gray-200 xl:pt-10 xl:dark:divide-gray-700">
            {/* TOC 左侧固定 */}
            <div className="order-1 border-0 xl:order-1 xl:col-span-3 xl:block">
              {/* Table of Contents */}
              <TableOfContents toc={toc} className="sticky top-24 xl:top-28" />
            </div>
            {/* 文章主体 */}
            <div className="order-2 xl:order-2 xl:col-span-9">
              <div className="prose dark:prose-invert max-w-none pb-8">{children}</div>
              {/* 上一篇，下一篇 */}
              <footer>
                <div className="">
                  {(next || prev) && (
                    <div className="mx-auto flex flex-col gap-4 sm:flex-row sm:gap-6">
                      {prev && prev.path && (
                        <Link
                          href={`/${prev.path}`}
                          className="max-w-[50%] flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                          <h2 className="mb-2 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            上一篇
                          </h2>
                          <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                            {prev.title}
                          </div>
                        </Link>
                      )}
                      {next && next.path && (
                        <Link
                          href={`/${next.path}`}
                          className="max-w-[50%] flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                          <h2 className="mb-2 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            下一篇
                          </h2>
                          <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                            {next.title}
                          </div>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </footer>
              {/* 评论 */}
              {siteMetadata?.comments?.provider && (
                <div
                  className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
