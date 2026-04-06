export class Article {
  constructor({ id, title, body, category, status = 'draft', authorId }) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.category = category;
    this.status = status;
    this.authorId = authorId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  update(updates) {
    Object.assign(this, updates);
    this.updatedAt = new Date();
    return this;
  }

  canTransitionTo(newStatus) {
    const validTransitions = {
      draft: ['in_review'],
      in_review: ['published', 'rejected'],
      published: [],
      rejected: ['draft']
    };
    return validTransitions[this.status].includes(newStatus);
  }
}
