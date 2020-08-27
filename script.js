const addBtns = document.querySelectorAll('.add-btn:not(.solid)')
const saveItemBtns = document.querySelectorAll('.solid')
const addItemContainers = document.querySelectorAll('.add-container')
const addItems = document.querySelectorAll('.add-item')
// Item Lists
const columList = document.querySelectorAll('.drag-item-list')
const backlogList = document.getElementById('backlog-list')
const progressList = document.getElementById('progress-list')
const completeList = document.getElementById('complete-list')
const onHoldList = document.getElementById('on-hold-list')

// Items
let updatedOnLoad = false

// Initialize Arrays
let backlogListArray = []
let progressListArray = []
let completeListArray = []
let onHoldListArray = []
let listArrays = []

// Drag Functionality
let draggedItem
let dragging = false
let currentColumn
// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
    if (localStorage.getItem('backlogItems')) {
        backlogListArray = JSON.parse(localStorage.backlogItems)
        progressListArray = JSON.parse(localStorage.progressItems)
        completeListArray = JSON.parse(localStorage.completeItems)
        onHoldListArray = JSON.parse(localStorage.onHoldItems)
    } else {
        backlogListArray = []
        progressListArray = []
        completeListArray = []
        onHoldListArray = []
    }
}

// Set localStorage Arrays
function updateSavedColumns() {
    listArrays = [
        backlogListArray,
        progressListArray,
        completeListArray,
        onHoldListArray,
    ]
    const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
    arrayNames.forEach((name, index) => {
        localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[index]))
    })
}

function filterArray(array) {
    const filteredArray = array.filter((item) => item)
    return filteredArray
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
    // List Item
    const listEl = document.createElement('li')
    listEl.classList.add('drag-item')
    listEl.textContent = item
    listEl.draggable = true
    listEl.setAttribute('ondragstart', 'drag(event)')
    listEl.contentEditable = true
    listEl.id = index
    listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
    columnEl.appendChild(listEl)
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
    // Check localStorage once
    if (!updatedOnLoad) {
        getSavedColumns()
    }
    // Backlog Column
    backlogList.textContent = ''
    backlogListArray.forEach((item, index) => {
        createItemEl(backlogList, 0, item, index)
    })
    backlogListArray = filterArray(backlogListArray)
    // Progress Column
    progressList.textContent = ''
    progressListArray.forEach((item, index) => {
        createItemEl(progressList, 1, item, index)
    })
    progressListArray = filterArray(progressListArray)
    // Complete Column
    completeList.textContent = ''
    completeListArray.forEach((item, index) => {
        createItemEl(completeList, 2, item, index)
    })
    completeListArray = filterArray(completeListArray)
    // On Hold Column
    onHoldList.textContent = ''
    onHoldListArray.forEach((item, index) => {
        createItemEl(onHoldList, 3, item, index)
    })
    onHoldListArray = filterArray(onHoldListArray)
    // Run getSavedColumns only once, Update Local Storage
    updatedOnLoad = true
    updateSavedColumns()
}

function updateItem(id, column) {
    const selectedArray = listArrays[column]
    const selectedColumnEl = columList[column].children
    if (!dragging) {
        if (!selectedColumnEl[id].textContent) {
            delete selectedArray[id]
        } else {
            selectedArray[id] = selectedColumnEl[id].textContent
        }
        updateDOM()
    }
}

function addToColumn(column) {
    if (addItems[column].textContent) {
        const itemText = addItems[column].textContent
        const selectedArray = listArrays[column]
        selectedArray.push(itemText)
        addItems[column].textContent = ''
        updateDOM()
    }
}

function showInputBox(column) {
    addBtns[column].style.visibility = 'hidden'
    saveItemBtns[column].style.display = 'flex'
    addItemContainers[column].style.display = 'flex'
}

function hideInputBox(column) {
    addBtns[column].style.visibility = 'visible'
    saveItemBtns[column].style.display = 'none'
    addItemContainers[column].style.display = 'none'
    addToColumn(column)
}

function rebuildArray() {
    backlogListArray = Array.from(backlogList.children).map(
        (child) => child.textContent
    )
    progressListArray = Array.from(progressList.children).map(
        (child) => child.textContent
    )
    completeListArray = Array.from(completeList.children).map(
        (child) => child.textContent
    )
    onHoldListArray = Array.from(onHoldList.children).map(
        (child) => child.textContent
    )
    updateDOM()
}

function drag(event) {
    draggedItem = event.target
    dragging = true
}
function allowDrop(e) {
    e.preventDefault()
}
function dragEnter(column) {
    columList[column].classList.add('over')
    currentColumn = column
}
function drop(e) {
    e.preventDefault()
    columList.forEach((column) => column.classList.remove('over'))
    const parent = columList[currentColumn]
    parent.appendChild(draggedItem)
    dragging = false
    rebuildArray()
}
//load
updateDOM()
// getSavedColumns()
// updateSavedColumns()
