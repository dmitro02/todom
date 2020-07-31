import React from 'react'
import './Projects.scss'
import Divider from '../Divider/Divider'
import Record, { IRecordConfig } from '../Record/Record'
import { IProject } from '../../types'
import { useTasksContext } from '../../contexts/TasksContext'

const Projects = () => {

    const [ store, dispatch ] = useTasksContext()

    const recordConfig: IRecordConfig = {
        useCheckMark: true,
        useDeleteBtn: true,
        useDragBtn: false,
        useEditBtn: true,
        isEditable: true
    }

    const projects: IProject[] = store.projects

    return (
        <div className="projects">
            <header>Projects</header>
            <Divider />
            {projects.map(
                project => <Record key={project.id} item={project} config={recordConfig}/>
            )}
        </div>  
    )
}

export default Projects