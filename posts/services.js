function toJson (post) {
  return {
    id: post.postId,
    creatorId: post.creatorId,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    likesCount: post.likedBy.length }
}

module.exports = { toJson }
