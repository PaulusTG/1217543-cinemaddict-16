import { UPDATE_TYPE, USER_ACTION } from '../utils/const.js';
import { remove, render, RenderPosition, replace } from '../utils/render.js';
import CommentsView from '../view/comments-view.js';
import ApiService from '../api-service.js';
import { AUTHORIZATION, END_POINT } from '../utils/const.js';

export default class CommentsPresenter {
  #commentsContainer = null;
  #commentsComponent = null;
  #changeData = null;
  #apiService = null;

  #comments = [];
  #filmId = null;

  #deletingComment = '';
  #isAborting = false;

  constructor(commentsContainer, changeData, filmId) {
    this.#commentsContainer = commentsContainer;
    this.#changeData = changeData;
    this.#filmId = filmId;

    this.#apiService = new ApiService(END_POINT, AUTHORIZATION);
  }

  init = async () => {
    const prevComments = this.#comments;

    try {
      const comments = await this.#apiService.getComments(this.#filmId);
      this.#comments = comments;
    } catch (err) {
      this.#comments = prevComments;
    }

    const prevComponent = this.#commentsComponent;

    this.#commentsComponent = new CommentsView(this.#comments, this.#deletingComment);

    this.#commentsComponent.setOnDeleteCommentClick(this.#onDeleteCommentClick);
    this.#commentsComponent.setOnAddCommentByEnterKeydown(this.#onAddCommentByEnterKeydown);

    if (prevComponent === null) {
      render(this.#commentsContainer, this.#commentsComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#commentsComponent, prevComponent);
  }

  destroy = () => {
    remove(this.#commentsComponent);
  }

  setDeleting = (deletingComment) => {
    this.#deletingComment = deletingComment;
  }

  setAborting = () => {
    this.#isAborting = true;
    this.makeShake();
  }

  makeShake = () => {
    if (this.#isAborting && this.#deletingComment !== '') {
      this.#deletingComment = '';
      this.#commentsComponent.shake(this.init);
    }
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
