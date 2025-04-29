import baseUrl from '../baseUrl/BaseUrl'

async function createPlaylist(name) {
    try {
        const res = await baseUrl.post('/playlist',{
            name
        },{withCredentials: true})

        return res
    } catch (error) {
        throw error
    }
}

async function getPlaylistsOfUser(userId) {
    // console.log('userId',userId)
    try {
        const res = await baseUrl.get(`/playlist/user/${userId}`,{
            withCredentials: true
        })
        return res
    } catch (error) {
        throw error
    }
}

async function addVideoToPlaylist(playlistId,videoId) {
    try {
        const res = await baseUrl.post(`/playlist/add/${videoId}/${playlistId}`,{},{
            withCredentials: true
        })

        return res
    } catch (error) {
        throw error
    }
}

async function getPlaylistById(playlistId) {
    try {
        const res = await baseUrl.get(`/playlist/${playlistId}`,{
            withCredentials:true
        })
        return res
    } catch (error) {
        throw error
    }
}

export {
    createPlaylist,
    getPlaylistsOfUser,
    addVideoToPlaylist,
    getPlaylistById
}