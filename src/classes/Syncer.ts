import { SyncStatuses } from '../components/Statuses/SyncStatus';
import DropboxConnector from './DropboxConnector';
import { actions } from './Notifier'
import * as lsUtils from "../utils/localStorageUtils"

const SYNC_INTERVAL_IN_MINUTES = 5 

export class Metadata {
    created: string[] = []
    deleted: string[] = []
}

export interface ICloudConnector {
    syncTarget: SyncTargets
    authorize: () => any
    check: () => any
    downloadMetadata: () => Promise<Metadata>
    downloadTaskList: () => Promise<string | null>
    uploadData: (metadata: Metadata, taskList: string) => any
}

export enum SyncTargets {
    Dropbox = 'DROPBOX',
    Disabled = 'DISABLED'
}

export enum SyncSources {
    Local = 'LOCAL',
    Remote = 'REMOTE' 
}

class Syncer {
    private cloudConnector: ICloudConnector | null = null
    private isSyncFaild: boolean = false
    private interval: any = null

    public constructor() {
        this.sync = this.sync.bind(this)
    }

    async initSync(source?: SyncSources, cloudConnector?: ICloudConnector) {
        if (cloudConnector) {
            this.cloudConnector = cloudConnector
            lsUtils.setSyncTarget(cloudConnector.syncTarget)
        } else {
            const syncTarget = lsUtils.getSyncTarget()
            if (syncTarget === SyncTargets.Disabled) {
                this.cloudConnector = null
            } else {
                this.cloudConnector = this.createCloudConnector(syncTarget)
            }
        }
        
        clearInterval(this.interval)

        const isConfigured = this.cloudConnector ? await this.check() : false        

        if (isConfigured) {
            source
                ? await this.forceUpdateFromSource(source)
                : await this.sync()

            this.interval = setInterval(this.sync, 60000 * SYNC_INTERVAL_IN_MINUTES)
        }
    }

    async sync() {
        this.isSyncFaild = false

        actions.setSyncStatus(SyncStatuses.InProgress)
    
        this.setSyncResultStatus()
    }

    private async forceUpdateFromSource(source: SyncSources) {
        this.isSyncFaild = false

        actions.setSyncStatus(SyncStatuses.InProgress)
        
        this.setSyncResultStatus()
    }

    private async check(): Promise<boolean> {
        try {
            await this.cloudConnector!.check()
        } catch(e) {
            if (e.message.toLowerCase().includes('not_configured')) {
                actions.setSyncStatus(SyncStatuses.NotConfigured)
                return false
            } else {
                actions.setSyncStatus(SyncStatuses.Failure)
                return true
            }
        }
        return true
    }

    private createCloudConnector(syncTarget?: SyncTargets) {
        switch (syncTarget) {
            case SyncTargets.Dropbox:
                return new DropboxConnector()
            default:
                return null
        }
    }

    private setSyncResultStatus() {
        if (this.isSyncFaild) {
            actions.setSyncStatus(SyncStatuses.Failure)
        } else {
            actions.setSyncStatus(SyncStatuses.Idle)
        }
    }
}

const syncer = new Syncer()

export default syncer
