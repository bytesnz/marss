"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARSS_POSTS_SET = 'MARSS_POSTS_SET';
exports.MARSS_POSTS_UPDATE = 'MARSS_POSTS_UPDATE';
exports.createPostsActions = ({ getState, dispatch, socket }, options) => {
    /// Timeout to timeout waiting for tags
    let fetchTimeout = null;
    /// Search timeouts
    let searchTimeouts;
    const setPosts = (newPosts) => {
        dispatch({
            type: exports.MARSS_POSTS_SET,
            data: newPosts
        });
    };
    const postsError = (message, code) => {
        dispatch({
            type: exports.MARSS_POSTS_SET,
            error: {
                message,
                code,
                date: new Date()
            }
        });
    };
    const updatePosts = (posts) => {
        dispatch({
            type: exports.MARSS_POSTS_UPDATE,
            data: posts
        });
    };
    const fetchPosts = () => {
        if (getState().posts === null && fetchTimeout === null) {
            fetchTimeout = setTimeout(() => {
                postsError('Nobody responded when trying to fetch the posts count', 408);
                fetchTimeout = null;
            }, 4000);
            socket.emit('documents');
        }
    };
    // Register for the tags event
    socket.on('documents', (data) => {
        clearTimeout(fetchTimeout);
        fetchTimeout = null;
        if (data.error) {
            postsError(data.error, data.code);
            return;
        }
        setPosts(data.results);
    });
    return {
        setPosts,
        updatePosts,
        fetchPosts
    };
};