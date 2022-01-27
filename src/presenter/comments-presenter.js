import { UPDATE_TYPE, USER_ACTION } from '../utils/const.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import CommentsView from '../view/comments-view.js';

export default class CommentsPresenter {
  #commentsContainer = null;
  #commentsComponent = null;
  #changeData = null;

  #comments = null;
  #filmId = null;

  constructor(commentsContainer, changeData, filmId) {
    this.#commentsContainer = commentsContainer;
    this.#changeData = changeData;
    this.#filmId = filmId;
  }

  init = (comments) => {
    this.#comments = comments;

    this.#commentsComponent = new CommentsView(this.#comments);

    this.#commentsComponent.setOnDeleteCommentClick(this.#onDeleteCommentClick);
    this.#commentsComponent.setOnAddCommentByEnterKeydown(this.#onAddCommentByEnterKeydown);

    render(this.#commentsContainer, this.#commentsComponent, RenderPosition.BEFOREEND);
  }

  destroy = () => {
    remove(this.#commentsComponent);
  }

  #onDeleteCommentClick = (commentId) => {
    this.#changeData(
      USER_ACTION.DELETE_COMMENT,
      UPDATE_TYPE.PATCH,
      { commentId, filmId: this.#filmId });
  }

  #onAddCommentByEnterKeydown = (newComment) => {
    this.#changeData(
      USER_ACTION.ADD_COMMENT,
      UPDATE_TYPE.PATCH,
      { newComment, filmId: this.#filmId });
  }
}
