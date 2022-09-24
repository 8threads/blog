import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { NotionRenderer, Collection, CollectionRow } from 'react-notion-x'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import Image from 'next/image'
import profilepic from '../public/profilepic.svg'

export async function getStaticProps () {
  const postsWithBio = await getAllPosts({ includePages: true })
  const posts = await getAllPosts({ includePages: false })
  const blockMap = await getPostBlocks(postsWithBio[0].id)
  const postsToShow = posts.slice(0, BLOG.postsPerPage)
  const totalPosts = posts.length
  const showNext = totalPosts > BLOG.postsPerPage
  return {
    props: {
      page: 1, // current page is 1
      postsToShow,
      showNext,
      shortBio: blockMap
    },
    revalidate: 1
  }
}

const blog = ({ postsToShow, page, showNext, shortBio }) => {
  return (
    <Container title={BLOG.title} description={BLOG.description}>
      <About shortBio={shortBio}/>
      <br></br>
      {postsToShow.map(post => (
        <BlogPost key={post.id} post={post} />
      ))}
      {showNext && <Pagination page={page} showNext={showNext} />}
    </Container>
  )
}

const About = ({ shortBio }) => {
  return (
    <article className="mb-8 mt-4 md:mb-10 md:mt-6 justify-center">
      <Avatar/>
      <Profile shortBio={shortBio}/>
      <HorizontalDivider/>
    </article>
  )
}

const Profile = ({ shortBio }) => {
  return (
    <div>
      <h2 className="text-lg md:text-xl font-medium mb-2 mt-4 cursor-pointer text-black dark:text-gray-100 text-center text">
        </h2>
      <div className="md:block leading-8 text-gray-700 dark:text-gray-300 text-center">
      <NotionRenderer
        recordMap={shortBio}
        components={{
          collection: Collection,
          collectionRow: CollectionRow
        }}
      />
      </div>
    </div>
  )
}

export const HorizontalDivider = () => {
  return <hr className="border-gray-200 dark:border-gray-600 mt-3" />
}

const Avatar = ({ shortBio }) => {
  return (
    <div className='h-1/4 w-1/4 overflow-hidden justify-items-center m-auto rounded-full border-4 border-rose-500'>
      <Image
        src={profilepic}
        alt="Profile Picture"
        layout="responsive"
        width={70}
        height={70}
      />
    </div>
  )
}

export default blog
