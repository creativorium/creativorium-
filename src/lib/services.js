import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const servicesDirectory = path.join(process.cwd(), 'src/data/services')

export function getSortedServicesData() {
  // Get file names under /services
  const fileNames = fs.readdirSync(servicesDirectory)
  const allData = fileNames.filter(fileName => fileName.endsWith('.md')).map(fileName => {
    // Read markdown file as string
    const fullPath = path.join(servicesDirectory, fileName)
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
  // Sort posts by id
  return allData.sort((a, b) => {
    if (a.id > b.id) {
      return 1
    } else {
      return -1
    }
  })
}

export function getRelatedServices(current_id) {
  // Get file names under /services
  const fileNames = fs.readdirSync(servicesDirectory)
  const allData = [];

  fileNames.filter((fileName) => fileName.endsWith('.md')).forEach(fileName => {
    // Read markdown file as string
    const fullPath = path.join(servicesDirectory, fileName)
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

  // Sort by id
  return allData.sort((a, b) => {
    if (a.id > b.id) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllServicesIds() {
  const fileNames = fs.readdirSync(servicesDirectory)
  return fileNames.filter(fileName => fileName.endsWith('.md')).map(fileName => {
    // Read the file to get the slug
    const fullPath = path.join(servicesDirectory, fileName)
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

export async function getServiceData(id) {
  // Find the file by slug (id parameter)
  const fileNames = fs.readdirSync(servicesDirectory)
  let fileName = null
  
  // First try to find by slug
  for (const file of fileNames) {
    if (file.endsWith('.md')) {
      const fullPath = path.join(servicesDirectory, file)
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
  
  const fullPath = path.join(servicesDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Use slug for id if available, otherwise use the id parameter
  const serviceId = matterResult.data.slug || id

  // Combine the data with the id and contentHtml
  return {
    id: serviceId,
    contentHtml,
    ...matterResult.data
  }
}