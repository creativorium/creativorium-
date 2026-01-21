import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'src/data/posts')

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  
  const allPostsData = fileNames.filter((fileName) => fileName.includes('.md') && !fileName.startsWith('categories/')).map(fileName => {
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use slug for id if available, otherwise use filename
    const id = matterResult.data.slug || fileName.replace(/\.md$/, '')

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getCategoryPosts(cat_id) {
  // Get file names under /posts
  const allData = [];
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.filter((fileName) => fileName.includes('.md') && !fileName.startsWith('categories/')).map(fileName => {
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
    const cats = matterResult.data.categories;

    // Use slug for id if available, otherwise use filename
    const id = matterResult.data.slug || fileName.replace(/\.md$/, '')

    if ( cats != undefined ) {
      // Check current category
      if ( cats.includes(cat_id) ) {
        // Combine the data with the id
        allData.push({
          id,
          ...matterResult.data
        });
      }
    }
  })
  // Sort posts by date
  return allData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getPaginatedPostsData(limit, page) {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.filter((fileName) => fileName.includes('.md') && !fileName.startsWith('categories/')).map(fileName => {
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use slug for id if available, otherwise use filename
    const id = matterResult.data.slug || fileName.replace(/\.md$/, '')

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })

  const paginatedPosts = allPostsData.slice((page - 1) * limit, page * limit)
  return { posts: paginatedPosts, total: allPostsData.length }
}

export function getFeaturedPostsData(ids) {
  
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allData = []
  fileNames.filter((fileName) => fileName.includes('.md') && !fileName.startsWith('categories/')).forEach(fileName => {
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use slug for id if available, otherwise use filename
    const id = matterResult.data.slug || fileName.replace(/\.md$/, '')

    if ( ids.includes(id) || ids.includes(fileName.replace(/\.md$/, '')) ) {
      // Combine the data with the id
      allData.push({
        id,
        ...matterResult.data
      });
    }
  })

  // Sort posts by date
  return allData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getRelatedPosts(current_id) {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allData = [];

  fileNames.filter((fileName) => fileName.includes('.md') && !fileName.startsWith('categories/')).forEach(fileName => {
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use slug for id if available, otherwise use filename
    const id = matterResult.data.slug || fileName.replace(/\.md$/, '')

    // Exclude current id from result
    if (id != current_id) {
      // Combine the data with the id
      allData.push({
        id,
        ...matterResult.data
      });
    }
  })

  // Sort posts by category
  return allData.sort((a, b) => {
    if (a.category > b.category) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostsIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.filter((fileName) => fileName.includes('.md') && !fileName.startsWith('categories/')).map(fileName => {
    // Read the file to get the slug
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    
    // Use slug if available, otherwise fall back to filename
    const slug = matterResult.data.slug || fileName.replace(/\.md$/, '')
    
    return {
      params: {
        id: slug
      }
    }
  })
}

export async function getPostData(id) {
  // Find the file by slug (id parameter)
  const fileNames = fs.readdirSync(postsDirectory)
  let fileName = null
  
  // First try to find by slug
  for (const file of fileNames) {
    if (file.includes('.md') && !file.startsWith('categories/')) {
      const fullPath = path.join(postsDirectory, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      
      if (matterResult.data.slug === id) {
        fileName = file
        break
      }
    }
  }
  
  // Fallback to filename if slug not found
  if (!fileName) {
    fileName = `${id}.md`
  }
  
  const fullPath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Use slug for id if available, otherwise use the id parameter
  const postId = matterResult.data.slug || id

  // Combine the data with the id and contentHtml
  return {
    id: postId,
    contentHtml,
    ...matterResult.data
  }
}