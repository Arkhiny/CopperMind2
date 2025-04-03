import React, {useEffect, useState} from 'react'
import supabase from '../helper/supabaseClient'
import { Navigate } from 'react-router'

function Wrapper({children}) {
    const [authenticated, setAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setAuthenticated(true)
            } else {
                setAuthenticated(false)
            }
            setLoading(false)
        }
        getSession()
    }, [])

    if (loading) return <div>Loading...</div>
    else if (authenticated) return children
    else return <Navigate to="/login" />
}

export default Wrapper