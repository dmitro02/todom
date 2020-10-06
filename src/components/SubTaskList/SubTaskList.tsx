import React from 'react'
import RecordList from '../RecordList/RecordList'
import { RecordConfig } from '../Record/Record'
import { Task } from '../../types'
import './SubTaskList.scss'

const activeRecordConfig: RecordConfig = {
    useDragBtn: true,
    isEditable: true
}

const completedRecordConfig: RecordConfig = { 
    ...activeRecordConfig, 
    useDragBtn: false
}

type Props = { 
    task: Task,
    isDisplayed?: boolean
}

const SubTaskList = (props: Props) => {
    const {
        task,
        isDisplayed = false
    } = props

    return (
        isDisplayed
            ? <RecordList 
                classNames={['subtasks-list']}
                root={task}
                activeRecordConfig={activeRecordConfig}
                completedRecordConfig={completedRecordConfig}
            />
            : null   
    )
}

export default SubTaskList