import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'src/data/posts')

// Helper function to get only markdown files (not directories)
function getMarkdownFiles() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.filter((fileName) => {
    const fullPath = path.join(postsDirectory, fileName)
    return fs.statSync(fullPath).isFile() && fileName.endsWith('.md')
  })
}

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = getMarkdownFiles()
  
  const allPostsData = fileNames.map(fileName => {
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
  const fileNames = getMarkdownFiles()
  
  fileNames.forEach(fileName => {
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
  const fileNames = getMarkdownFiles()
  const allPostsData = fileNames.map(fileName => {
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
  const fileNames = getMarkdownFiles()
  const allData = []
  
  fileNames.forEach(fileName => {
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
  const fileNames = getMarkdownFiles()
  const allData = [];

  fileNames.forEach(fileName => {
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
  const fileNames = getMarkdownFiles()
  return fileNames.map(fileName => {
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

// Helper function to insert content images into HTML content
function insertContentImages(contentHtml, contentImages) {
  if (!contentImages || contentImages.length === 0) {
    return contentHtml
  }
  
  // Split content by h2 tags to find insertion points
  const h2Regex = /(<h2[^>]*>.*?<\/h2>)/g
  const parts = contentHtml.split(h2Regex)
  
  // Insert images after every 2-3 sections (after h2 tags)
  let imageIndex = 0
  let sectionCount = 0
  const result = []
  
  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i])
    
    // If this is an h2 tag, increment section count
    if (parts[i].match(/^<h2[^>]*>/)) {
      sectionCount++
      
      // Insert image after every 2 sections (after 2nd, 4th, etc.)
      if (sectionCount > 0 && sectionCount % 2 === 0 && imageIndex < contentImages.length) {
        const image = contentImages[imageIndex]
        result.push(`<div class="mil-content-image"><img src="${image}" alt="Content image ${imageIndex + 1}" /></div>`)
        imageIndex++
      }
    }
  }
  
  // If we have remaining images and sections, insert them near the end
  if (imageIndex < contentImages.length && sectionCount > 0) {
    // Insert remaining images before the last section
    const lastImageIndex = result.length - 1
    for (let i = imageIndex; i < contentImages.length; i++) {
      const image = contentImages[i]
      result.splice(lastImageIndex, 0, `<div class="mil-content-image"><img src="${image}" alt="Content image ${i + 1}" /></div>`)
    }
  }
  
  return result.join('')
}

export async function getPostData(id) {
  // Find the file by slug (id parameter)
  const fileNames = getMarkdownFiles()
  let fileName = null
  
  // First try to find by slug
  for (const file of fileNames) {
    const fullPath = path.join(postsDirectory, file)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    
    if (matterResult.data.slug === id) {
      fileName = file
      break
    }
  }
  
  // Fallback to filename if slug not found
  if (!fileName) {
    // Try to find by filename (without .md extension)
    const potentialFile = `${id}.md`
    const potentialPath = path.join(postsDirectory, potentialFile)
    if (fs.existsSync(potentialPath) && fs.statSync(potentialPath).isFile()) {
      fileName = potentialFile
    } else {
      // If still not found, throw an error
      throw new Error(`Post with id "${id}" not found`)
    }
  }
  
  const fullPath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  let contentHtml = processedContent.toString()

  // Insert content images if they exist
  if (matterResult.data.contentImages && Array.isArray(matterResult.data.contentImages)) {
    contentHtml = insertContentImages(contentHtml, matterResult.data.contentImages)
  }

  // Use slug for id if available, otherwise use the id parameter
  const postId = matterResult.data.slug || id

  // Combine the data with the id and contentHtml
  return {
    id: postId,
    contentHtml,
    ...matterResult.data
  }
}