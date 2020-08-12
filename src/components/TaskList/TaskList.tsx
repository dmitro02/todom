import React, { useEffect } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { ITask } from '../../types'
import { RecordConfig } from '../Record/Record'
import './TaskList.scss'
import RecordList from '../RecordList/RecordList'

const activeRecordConfig: RecordConfig = {
    useCheckMark: true,
    useDeleteBtn: true,
    useDragBtn: true,
    isEditable: true
}

const completedRecordConfig: RecordConfig = { 
    ...activeRecordConfig, 
    useDragBtn: false
}

const TaskList = () => {
    const [ store ] = useTasksContext()

    const { tasks } = store.rootProject

    const root = tasks.length 
        ? tasks.find((p: ITask) => p.path === store.rootProject.selectedTaskPath)
        : null

    useEffect(() => { 
        // console.log('RENDER TASK LIST - ' + root.path)
    })

    if (!root) return null

    return (
        <RecordList 
            classNames={['task-list']}
            root={root}
            activeRecordConfig={activeRecordConfig}
            completedRecordConfig={completedRecordConfig}
        />
    )
}

export default TaskList
