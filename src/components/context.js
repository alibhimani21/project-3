import React, { createContext, useState, useEffect } from 'react'
import jwt from 'jsonwebtoken'
import Axios from 'axios'

// CURRENT USER CONTEXT

export const UserContext = createContext()

export const UserProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState({
    isLoggedIn: !!localStorage.getItem('token'),
    id: jwt.decode(localStorage.getItem('token'))?.sub
  })

  useEffect(() => {
    Axios.get(`/api/users/${currentUser.id}`)
      .then(response => setCurrentUser({
        ...response.data,
        recAreaWishList: response.data.recAreaWishList.map(site => site._id),
        campgroundWishList: response.data.campgroundWishList.map(site => site._id),
        campgroundsVisited: response.data.campgroundsVisited.map(site => site._id),
        recAreasVisited: response.data.recAreasVisited.map(site => site._id),
        isLoggedIn: true,
        id: response.data._id
      }))
      .catch(err => console.log(err))
  }, [currentUser.id])

  const logIn = (data) => {
    localStorage.setItem('token', data.token)
    setCurrentUser({ 
      ...data,
      isLoggedIn: true, 
      showWishList: data.showWishList ?? true, 
      showVisited: data.showVisited ?? true
    })
  }

  const logOut = () => {
    localStorage.removeItem('token')
    setCurrentUser({
      ...currentUser,
      isLoggedIn: false
    })
  }

  const toggleListDisplay = (e) => {
    setCurrentUser({
      ...currentUser,
      [e.target.name]: !e.target.checked
    })
  }

  const setListDisplayPreferences = (data) => {
    setCurrentUser({
      ...currentUser,
      showWishList: data.showWishList ?? true, 
      showVisited: data.showVisited ?? true 
    })
  }

  const updateWishList = (siteWishList, siteId) => {
    if (currentUser[siteWishList].includes(siteId)) {
      setCurrentUser({
        ...currentUser,
        [siteWishList]: currentUser[siteWishList].filter(site => site !== siteId)
      })
    } else {
      setCurrentUser({
        ...currentUser,
        [siteWishList]: [...currentUser[siteWishList], siteId]
      })
    }
  }

  const updateVisited = (siteVisitedList, siteId) => {
    if (currentUser[siteVisitedList].includes(siteId)) {
      setCurrentUser({
        ...currentUser,
        [siteVisitedList]: currentUser[siteVisitedList].filter(site => site !== siteId)
      })
    } else {
      setCurrentUser({
        ...currentUser,
        [siteVisitedList]: [...currentUser[siteVisitedList], siteId]
      })
    }
  }

  return (
    <UserContext.Provider value={{ 
      currentUser,
      logIn, 
      logOut, 
      updateWishList,
      updateVisited,
      toggleListDisplay, 
      setListDisplayPreferences 
    }}>
      {children}
    </UserContext.Provider>
  )

}


// DARK/LIGHT MODE THEME CONTEXT

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {

  const [darkModeOn, setDarkModeOn] = useState(false)

  const toggleDarkMode = () => setDarkModeOn(previous => !previous)

  return (
    <ThemeContext.Provider value={{ darkModeOn, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )

}