import React, { useRef } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import DropboxConnector from '../../utils/DropboxConnector'
import { 
    setBanner, 
    setLoading 
} from '../../contexts/actionCreators'
import { 
    FailureBanner, 
    SuccessBanner 
} from '../../types'

const DropboxSettings = () => {
    const [, dispatch ] = useTasksContext()

    // const { rootProject } = store

    const dbx = new DropboxConnector()

    const authTokenRef = useRef<HTMLInputElement>(null)

    const authorizeApp = async () => {
        dispatch(setLoading(true))
        try {
            await dbx.auhtorize(authTokenRef.current?.value)
            dispatch(setBanner(new SuccessBanner('Application successfully authorized')))
        } catch(e) {
            dispatch(setBanner(new FailureBanner('Error: ' + e.message)))
        }
        dispatch(setLoading(false))   
    }

    const checkConnection = async () => {
        try {
            await dbx.check()
            dispatch(setBanner(new SuccessBanner('Successfully accessed Dropbox')))
        } catch(e) {
            dispatch(setBanner(new FailureBanner(e.message)))
        } 
    }

    return (
        <div className="settings-block">
            <h2>
                Dropbox Synchronization
                {dbx.isConfigured && 
                    <span className="already-authorized" title="Already configured">
                        &#10004;
                    </span>
                }
            </h2>
            <p>
                Get authorization code <a href={dbx.authUrl} target="_black">here</a>
                , insert it into the input below and click "Authorize" button. 
            </p>
            <input 
                type="text" 
                size={48} 
                placeholder="authorizarion code"
                ref={authTokenRef}
                className="auth-code"
            />
            <button onClick={authorizeApp}>Authorize</button>
            <button onClick={checkConnection}>Check</button>

            <button onClick={() => dbx.getMetadata()}>TEST1</button>
            <button onClick={() => dbx.uploadMetadata({ updatedAt: Date.now() })}>TEST2</button>
        </div>
    )
}

export default DropboxSettings
