import SmartView from './smart-view.js';
import { EMOJIES } from '../utils/const.js';
import { isCtrlPlusEnterKey } from '../utils/common.js';
import dayjs from 'dayjs';
import he from 'he';

const createCommentTemplate = ({ id, emotion, comment, author, date }, deletingComment) => {
  const isDeleting = id === deletingComment;

  return `<li data-id="${id}" class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(date).format('YYYY/M/D H:mm')}</span>
        <button data-id="${id}" class="film-details__comment-delete" ${deletingComment ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
      </p>
    </div>
  </li>`;
};

const createComments = (comments, deletingComment) => {
  let commentsList = [];

  commentsList = comments.map((comment) => createCommentTemplate(comment, deletingComment));

  return commentsList.join('');
};

const createEmojiListTemplate = () => (
  EMOJIES.map((emoji) => `
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`).join('')
);

const createCommentsTemplate = (comments, newCommentSettings, deletingComment) => {
  const {
    isEmojiChoosen,
    newCommentEmoji,
  } = newCommentSettings;

  const commentsList = createComments(comments, deletingComment);
  const emojiList = createEmojiListTemplate();

  const choosenEmoji = isEmojiChoosen
    ? `<img src="./images/emoji/${newCommentEmoji}.png" width="70" height="70" alt="emoji">`
    : '';

  return `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
        ${commentsList}
      </ul>

      <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">${choosenEmoji}</div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          ${emojiList}
        </div>
      </div>
    </section>`;
};

export default class CommentsView extends SmartView {
  #emojiItems = null;
  #newCommentSettings = {};
  #newComment = {};
  #deletingComment = '';

  constructor(comments, deletingComment) {
    super();
    this._data = comments;

    this.#deletingComment = deletingComment;

    this.#setInnerHandlers();
  }

  get template() {
    return createCommentsTemplate(this._data, this.#newCommentSettings, this.#deletingComment);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setOnDeleteCommentClick();
    this.setOnAddCommentByEnterKeydown();
  }

  reset = (comments) => {
    this.updateData(
      CommentsView.parseCommentToData(comments),
    );
  }

  #setInnerHandlers = () => {
    this.#emojiItems = this.element.querySelectorAll('.film-details__emoji-item');
    this.#emojiItems
      .forEach((item) => item.addEventListener('click', this.#onChooseEmoji));
  }

  setOnDeleteCommentClick = (callback) => {
    if (callback) {
      this._callback.deleteComment = callback;
    }
    this.element.querySelectorAll('.film-details__comment-delete')
      .forEach((button) => button.addEventListener('click', this.#onDeleteCommentClick));
  }

  #onDeleteCommentClick = (evt) => {
    evt.preventDefault();
    this._callback.deleteComment(evt.target.dataset.id);
  }

  setOnAddCommentByEnterKeydown = (callback) => {
    if (callback) {
      this._callback.addComment = callback;
    }
    document.addEventListener('keydown', this.#onAddCommentByEnterKeydown);
  }

  #onAddCommentByEnterKeydown = (evt) => {
    const newCommentText = he.encode(this.element.querySelector('.film-details__comment-input').value);

    if (this.#newCommentSettings.isEmojiChoosen && newCommentText !== '' && isCtrlPlusEnterKey(evt)) {

      this.#newComment = {
        emotion: this.#newCommentSettings.newCommentEmoji,
        comment: newCommentText,
      };

      this._callback.addComment(this.#newComment);
      document.removeEventListener('keydown', this.#onAddCommentByEnterKeydown);
    }
  }

  #onChooseEmoji = (evt) => {
    evt.preventDefault();

    this.#newCommentSettings = {
      isEmojiChoosen: evt.target.checked,
      newCommentEmoji: evt.target.value,
    };

    this.updateElement();

    this.#emojiItems.forEach((item) => {
      if (item.value === evt.target.value) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
  }

  static parseCommentToData = (comment) => ({
    ...comment,
    isEmojiChoosen: false,
    newCommentEmoji: '',
  });

  static parseDataToComment = (data) => {
    const comment = { ...data };

    return comment;
  }
}
