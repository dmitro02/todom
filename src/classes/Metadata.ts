import { ROOT_ID } from './../utils/taskService';
import * as lsUtils from '../utils/localStorageUtils'

export type Item = {
    id: string
    parentId: string | null
    updatedAt: number
}

export class Metadata {
    taskList: { [id: string]: { p: string | null, u: number } }
    created: string[] = []
    deleted: string[] = []
    updated: string[] = []

    constructor() {
        this.taskList = {}
    }

    addToTaskList(item: Item): void {
        const { id, parentId, updatedAt } = item
        this.taskList[id] = {
            p: parentId,
            u: updatedAt
        }
    }

    removeFromTaskList(id: string): void {
        delete this.taskList[id]
    }

    addToCreated(id: string): void {
        this.created.push(id)
    }

    removeFromCreated(id: string): void {
        if (this.created.includes(id)) {
            this.created = this.created.filter((it) => it !== id)
        }
    }

    addToDeleted(id: string): void {
        this.deleted.push(id)
    }

    addToUpdated(id: string): void {
        this.updated.push(id)
    }

    registerCreated(item: Item): void {
        this.addToTaskList(item)
        this.addToCreated(item.id)
        this.save()
    }

    registerUpdated(item: Item): void {
        this.addToTaskList(item)
        this.save()
    }

    registerDeleted(id: string): void {
        this.removeFromTaskList(id)
        this.created.includes(id)
            ? this.removeFromCreated(id)
            : this.addToDeleted(id)
        this.save()
    }

    getChildrenIds(parentId: string): string[] {
        return Object.keys(this.taskList).reduce((acc: string[], curr) => {
            if (this.taskList[curr].p === parentId) acc.push(curr)
            return acc
        }, [])
    }

    hasChildren(parentId: string): boolean {
        return Object.values(this.taskList).some((it) => it.p === parentId)
    }

    save(): void {
        const metadata = {
            taskList: this.taskList,
            created: this.created,
            deleted: this.deleted
        }
        lsUtils.setMetadada(metadata)
    }

    restore(): void {
        const metadata = lsUtils.getMetadada()
        this.taskList = metadata.taskList
        this.created = metadata.created
        this.deleted = metadata.deleted
    }

    reset(): void {
        this.created = []
        this.deleted = []
        this.updated = []
        this.save()
    }

    init(): void {
        lsUtils.hasMetadata()
            ? this.restore() 
            : this.save()
    }
}

const metadata = new Metadata()

export default metadata
