import {AnimatePresence, motion} from "framer-motion"
import React, {useState} from "react"
import {useSnapshot} from "valtio"

import {DecalTypes, EditorTabs, FilterTabs} from "../config/constants"
import {reader} from "../config/helpers"
import state from "../store"

import {ColorPicker, CustomButton, FilePicker, Tab} from "../components"
import {fadeAnimation, slideAnimation} from "../config/motion"

const Customizer = () => {
  const snap = useSnapshot(state)

  const [file, setFile] = useState([])

  const [activeEditorTab, setActiveEditorTab] = useState("")
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })


  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />
      default:
        return null
    }
  }

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type]

    state[decalType.stateProperty] = result

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName]
        break
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName]
        break
      default:
        state.isLogoTexture = true
        state.isFullTexture = false
    }

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      }
    })
  }

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result)
      setActiveEditorTab("")
    })
  }
  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer
