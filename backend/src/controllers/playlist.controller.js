import { db } from "../libs/db";

export const createPlaylist = async(req, res) => {
    try {
        const {name, description} = req.body;
        const userId = req.user.id;

        const playlist = await db.playlist.create({
            data: {
                name,
                description,
                userId
            }
        });

        res.status(200).json({
            success: true,
            message: "Playlist created successfully",
            playlist
        })
    } catch (error) {
        console.error();
        res.status(500).json({
            error: "Error in createing problem"
        })
    }
}

export const getAllListDetails = async(req, res) => {
    try {
        const playlist = await db.playlist.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlist
        })
    } catch (error) {
        console.error("Error fetching playlist: ",error);
        res.status(500).json({error: "Error fetching playlist"});
    }
}

export const getPlayListDetails = async(req, res) => {
    try {
        const {playlistId} = req.params;

        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId,
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })

        if(!playlist){
            return res.status(404).json({
                error: "Playlist not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Playlist fetch successfully",
            playlist
        })
    } catch (error) {
        console.error("Error while fetching playlist: ", error);
        res.status(500).json({
            error: "Error while fetching playlist"
        })
    }
}

export const addProblemToPlaylist = async(req, res) => {
    try {
        const {playlistId} = req.params;
        const {problemsIds} = req.body;

        if(!Array.isArray(problemsIds) || problemsIds.length === 0){
            return res.status(400).json({error: "Invalid or missing problemsId"})
        }

        const problemsInPlaylist = await db.problemsInPlaylist.createMany({
            data: problemsIds.map( (problemsId) => ({
                playlistId,
                problemsId
            }))
        })

        res.status(201).json({
            success: true,
            message: "Problems added to playlist successfully",
            problemsInPlaylist
        })
    } catch (error) {
        console.error("Error in adding problme in playlist: ", error);
        res.status(500).json({
            error: "Error in adding problme in playlist"
        })
    }
}

export const deletePlaylist = async(req, res) => {
    try {
        const {playlistId} = req.params;

        const deletePlaylist = await db.playlist.delete({
            where: {
                id: playlistId,
            }
        });

        res.status(200).json({
            success: true,
            message: "Playlist deleted succesfully",
            deletePlaylist
        })
    } catch (error) {
        console.error("Error while deleting playlist: ", error);
        res.status(500).json({
            error: "Error while deleting playlist"
        })
    }
}

export const removeProblemFromPlaylist = async(req, res) => {
    try {
        const {playlistId} = req.params;
        const {problemsIds} = req.body;

        if(!Array.isArray(problemsIds) || problemsIds.length === 0){
            return res.status(400).json({error: "Invalid or missing problemsId"})
        }

        const deleteProblems = await db.addProblemToPlaylist.deleteMany({
            wehre: {
                playlistId,
                problemsId: {
                    in: problemsIds,
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Problem remove from playlist",
            deleteProblems
        })
    } catch (error) {
        console.error("Error in remove from playlist: ", error);
        res.status(500).json({
            error: "Error in remove from playlist"
        })
    }
} 