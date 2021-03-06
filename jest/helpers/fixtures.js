const api = require('../../src/api')

// Creators: create data (tutorials, lessons)
function createTutorial (config = { override: {}, lessons: 0, resources: 0 }) {
  const { tutorial, lessons, resources } = generateTutorial(config)
  const createdTutorial = api.tutorials.create(tutorial)

  for (let i = 0; i < lessons.length; ++i) {
    api.lessons.create(api.tutorials.get(createdTutorial.id), lessons[i])
  }

  resources.forEach(resource => {
    api.resources.add(createdTutorial.id, resource)
  })

  return api.tutorials.get(createdTutorial.id)
}

// Generators: generate data to be used

function generateTutorial (config = { override: {}, lessons: 0, resources: 0 }) {
  const suffix = api.tutorials.getNextTutorialId()

  const tutorial = {
    title: `New Tutorial (${suffix})`,
    url: `new-tut-${suffix}`,
    project: 'libp2p',
    description: 'New tutorial description',
    ...config.override
  }

  const lessons = new Array(config.lessons).fill().map((_, i) => (
    generateLesson({ override: { title: `Lesson ${i + 1}` } }).lesson
  ))

  const resources = new Array(config.resources).fill().map((_, i) => (
    generateResource({
      override: {
        title: `Resource ${i + 1}`,
        link: `https://resource${i + 1}.com`
      }
    }).resource
  ))

  return {
    tutorial,
    lessons,
    resources,
    expected: { ...tutorial, lessons, resources }
  }
}

function generateLesson ({ createTutorial = false, override = {} } = {}) {
  const lesson = {
    title: 'Lesson',
    type: 'text',
    ...override
  }
  let tutorial

  if (createTutorial) {
    tutorial = api.tutorials.create(generateTutorial().tutorial)
    api.courses.add(tutorial.id)
  }

  return {
    lesson,
    tutorial,
    expected: { lesson, tutorial }
  }
}

function generateResource ({ createTutorial, override = {} } = {}) {
  const resource = {
    title: 'Resource',
    link: 'https://resource.com',
    description: 'Resoure description',
    type: 'demo',
    ...override
  }
  let tutorial

  if (createTutorial) {
    tutorial = api.tutorials.create(generateTutorial().tutorial)
    api.courses.add(tutorial.id)
  }

  return {
    resource,
    tutorial,
    expected: { resource, tutorial }
  }
}

module.exports = {
  createTutorial,
  generateTutorial,
  generateLesson,
  generateResource
}
