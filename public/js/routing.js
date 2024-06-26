import {
  dateManipulator,
  putCategory,
  pageTitleUpdater,
  getParams,
  normalCaseMaker,
  dataFilter,
} from './utils/routingUtils.js'

const [id, category] = getParams()

//   Putting Category in the page
console.log(id, category)

const titleDiv = document.getElementById('title')
const desp = document.getElementById('description')
const imgContainer = document.getElementById('image')
const dateDiv = document.getElementById('date')

if (parseInt(id) === 0) {
  titleDiv.innerHTML =
    'All ' + normalCaseMaker(`${category}${category === 'news' ? '' : 's'}`)
  const list = document.getElementById('list')
  fetch(`/api/${category}/get/all`)
    .then((response) => response.json())
    .then((apidata) => {
      console.log(apidata)
      putCategory(category)

      const data = dataFilter(apidata)
      console.log(data)
      data.forEach((e) => {
        const listItem = document.createElement('li')

        listItem.innerHTML = `  
                <a
                class = 'underline underline-offset-4 decoration-accent decoration-0 hover:decoration-2'
                    ${e.newPage
            ? `target = "_blank" href= "${e.pdfLink}"`
            : `href = "/template/index.html?id=${e._id}?category=${category}"`
          }
                  >
                  ${e?.title || e?.desc}
                </a>


                ${e?.new
            ? `<div id="new-tag" class="inline-flex ml-2 items-center justify-start space-x-2">
            <span class="material-symbols-outlined text-accent-orange">
              auto_awesome
            </span>
            <p class="text-lg font-bold uppercase text-accent-orange">
              New
            </p>
          </div>`
            : ''
          }



              `
        list.appendChild(listItem)
      })
    })
    .catch((err) => {
      console.log(err)
    })
} else {
  fetch(`/api/${category}?id=${id}`)
    .then((response) => response.json())
    .then((data) => {

      // console.log(data)
      let localData = null
      if (Array.isArray(data) && data.length !== 0) {
        console.log(data)
        localData = data[0]
      } else {
        localData = data
      }
      console.log('localData', localData)
      let title = localData?.title2 || localData?.title
      putCategory(localData?.title1 || category)

      if (title === undefined) title = category

      titleDiv.innerHTML = title.charAt(0).toUpperCase() + title.slice(1)
      if (localData?.desc) desp.innerHTML = localData?.desc
      dateDiv.innerHTML = dateManipulator(localData.updatedAt)
      if (localData.image)
        imgContainer.innerHTML = ` <img src = "${localData.image}" id="image" class="max-w-4xl rounded-xl mt-10 w-full" />`
      pageTitleUpdater(category, localData?.title1 || localData?.title)
      // pageTitleUpdater(data[0]?.title1 || data[0].title)
      //  pageTitleUpdater(data[0].title1)

    })
    .catch((err) => {
      console.log(err)
    })
}
